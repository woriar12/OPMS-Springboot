import React, { useState } from 'react';
import { adminService } from '../services/adminService';
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  FileText,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const BulkImportPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setResult(null);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await adminService.downloadSampleTemplate();
    } catch (err) {
      setError('Failed to download template file');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a CSV or Excel (.xlsx) file to upload.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);
      const data = await adminService.importStudents(file);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'File processing failed. Please check file format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Student Bulk Import</h1>
          <p className="text-xs text-slate-500 mt-1">
            Import bulk student records, auto-generate accounts, and trigger credential notification emails.
          </p>
        </div>
        <button
          onClick={handleDownloadTemplate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl shadow-sm transition-all"
        >
          <Download className="w-4 h-4 text-blue-600" />
          Download Sample Template (.CSV)
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          {error}
        </div>
      )}

      {/* Main Upload Box */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-soft">
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold shadow-sm">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              {file ? file.name : 'Choose CSV or Excel (.xlsx) file to upload'}
            </p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Supported file extensions: .csv, .xlsx, .xls (Max file size: 10MB)
            </p>

            <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all">
              <Upload className="w-4 h-4" />
              Browse File
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Auto-account creation: Password generated using BCrypt
            </div>

            <button
              type="submit"
              disabled={!file || loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Batch...
                </>
              ) : (
                <>
                  Import & Generate Accounts
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Validation Result Preview Card */}
      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Rows Read</span>
              <p className="text-3xl font-black text-slate-900 mt-1">{result.totalRecords}</p>
            </div>
            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-200 shadow-soft">
              <span className="text-xs font-bold text-emerald-700 uppercase">Successfully Imported</span>
              <p className="text-3xl font-black text-emerald-700 mt-1">{result.successfulRecords}</p>
            </div>
            <div className="bg-red-50/50 rounded-2xl p-6 border border-red-200 shadow-soft">
              <span className="text-xs font-bold text-red-700 uppercase">Failed Rows</span>
              <p className="text-3xl font-black text-red-700 mt-1">{result.failedRecords}</p>
            </div>
          </div>

          {/* Row-by-Row Failure Breakdown */}
          {result.errors && result.errors.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 text-red-700 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Row Validation Failure Details ({result.errors.length})
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100">
                      <th className="px-4 py-3">Row #</th>
                      <th className="px-4 py-3">Invalid Field</th>
                      <th className="px-4 py-3">Validation Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                    {result.errors.map((err, idx) => (
                      <tr key={idx} className="hover:bg-red-50/40">
                        <td className="px-4 py-3 font-bold text-slate-900">Row {err.row}</td>
                        <td className="px-4 py-3 font-mono text-red-600 font-bold">{err.field}</td>
                        <td className="px-4 py-3 text-slate-600">{err.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
