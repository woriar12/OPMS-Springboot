import React, { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import { FileQuestion, Send, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const StudentCorrectionPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [fieldName, setFieldName] = useState('Department');
  const [currentValue, setCurrentValue] = useState('');
  const [requestedValue, setRequestedValue] = useState('');
  const [reason, setReason] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await studentService.getMyCorrectionRequests();
      setRequests(data);
    } catch (err) {
      setError('Failed to fetch request history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentValue.trim() || !requestedValue.trim() || !reason.trim()) {
      setError('All fields are required to raise a correction request.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      await studentService.createCorrectionRequest({
        fieldName,
        currentValue: currentValue.trim(),
        requestedValue: requestedValue.trim(),
        reason: reason.trim(),
      });

      setSuccess('Correction request submitted to Admin successfully!');
      setCurrentValue('');
      setRequestedValue('');
      setReason('');
      fetchRequests();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Master Data Correction Request</h1>
        <p className="text-xs text-slate-500 mt-1">
          If your institutional master details (Department, CGPA, Backlogs, etc.) are wrong, submit a verification request.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          {error}
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-soft">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <FileQuestion className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Submit Discrepancy Ticket</h2>
            <p className="text-xs text-slate-500">Requires review and explicit approval by Placement Admin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Field to Correct</label>
              <select
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
              >
                <option value="Department">Department</option>
                <option value="CGPA">CGPA</option>
                <option value="Active Backlogs">Active Backlogs</option>
                <option value="Address">Address</option>
                <option value="Student Name">Student Name</option>
                <option value="College">College</option>
                <option value="University">University</option>
                <option value="Batch">Batch</option>
                <option value="Semester">Semester</option>
                <option value="Email">Email</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Displayed Value</label>
              <input
                type="text"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                placeholder="e.g. ECE"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Correct / Requested Value</label>
              <input
                type="text"
                value={requestedValue}
                onChange={(e) => setRequestedValue(e.target.value)}
                placeholder="e.g. CSE"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Reason for Discrepancy</label>
            <textarea
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this master data is incorrect (e.g. Department was mistakenly entered during bulk import)..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting Request...' : 'Submit Request to Admin'}
            </button>
          </div>
        </form>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Submitted Requests History</h3>
          <p className="text-xs text-slate-500">Live status tracking of your raised data corrections</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100">
                <th className="px-6 py-4">Submitted Date</th>
                <th className="px-6 py-4">Field</th>
                <th className="px-6 py-4">Current Value</th>
                <th className="px-6 py-4">Requested Value</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Admin Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                    Loading requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                    You have not raised any correction requests.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-purple-600 uppercase">{req.fieldName}</td>
                    <td className="px-6 py-4 text-slate-400 line-through">{req.currentValue}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">{req.requestedValue}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{req.reason}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : req.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {req.status === 'PENDING' && <Clock className="w-3 h-3 text-amber-500" />}
                        {req.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                        {req.status === 'REJECTED' && <XCircle className="w-3 h-3 text-red-500" />}
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 italic">
                      {req.adminComment || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
