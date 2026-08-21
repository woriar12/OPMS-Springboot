import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { FileQuestion, CheckCircle2, XCircle, Clock, AlertCircle, MessageSquare, X } from 'lucide-react';

export const AdminCorrectionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [activeReq, setActiveReq] = useState(null);
  const [modalType, setModalType] = useState(null); // 'APPROVE' | 'REJECT'
  const [adminComment, setAdminComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCorrectionRequests();
      setRequests(data);
    } catch (err) {
      setError('Failed to load correction requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const openDecisionModal = (req, type) => {
    setActiveReq(req);
    setModalType(type);
    setAdminComment('');
    setIsModalOpen(true);
  };

  const handleDecision = async (e) => {
    e.preventDefault();
    if (!activeReq || !modalType) return;

    try {
      setSubmitting(true);
      if (modalType === 'APPROVE') {
        await adminService.approveCorrection(activeReq.id, adminComment);
        setSuccess(`Correction request #${activeReq.id} approved and student master data updated!`);
      } else {
        await adminService.rejectCorrection(activeReq.id, adminComment);
        setSuccess(`Correction request #${activeReq.id} rejected.`);
      }
      setActiveReq(null);
      setModalType(null);
      fetchRequests();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Master Correction Requests</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review data discrepancy requests raised by students and approve master updates
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
          Pending Review: {requests.filter((r) => r.status === 'PENDING').length}
        </span>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          {success}
        </div>
      )}

      {/* Requests Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">Student & Reg No</th>
                <th className="px-6 py-4">Target Field</th>
                <th className="px-6 py-4">Current Value</th>
                <th className="px-6 py-4">Requested Value</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
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
                    No correction requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{req.studentName}</p>
                      <p className="font-mono text-[11px] text-blue-600">{req.registerNumber}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-purple-600 uppercase">{req.fieldName}</td>
                    <td className="px-6 py-4 text-slate-500 line-through">{req.currentValue}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">{req.requestedValue}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${req.status === 'PENDING'
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
                    <td className="px-6 py-4 text-right">
                      {req.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDecisionModal(req, 'APPROVE')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openDecisionModal(req, 'REJECT')}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold rounded-lg transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          {req.adminComment || 'Processed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approve / Reject Dialog */}
      {activeReq && modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900">
                {modalType === 'APPROVE' ? 'Approve Master Correction' : 'Reject Correction Request'}
              </h3>
              <button
                onClick={() => {
                  setActiveReq(null);
                  setModalType(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-2 mb-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p><span className="text-slate-400">Student:</span> <strong>{activeReq.studentName}</strong> ({activeReq.registerNumber})</p>
              <p><span className="text-slate-400">Field:</span> <strong className="uppercase">{activeReq.fieldName}</strong></p>
              <p><span className="text-slate-400">Change:</span> {activeReq.currentValue} &rarr; <strong className="text-emerald-600">{activeReq.requestedValue}</strong></p>
            </div>

            <form onSubmit={handleDecision} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Comment / Note {modalType === 'REJECT' && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  rows="3"
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder={
                    modalType === 'APPROVE'
                      ? 'e.g. Master record updated after verification'
                      : 'Provide rejection reason for student notification'
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveReq(null);
                    setModalType(null);
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2 text-white text-xs font-bold rounded-xl shadow-sm ${modalType === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                  {submitting ? 'Processing...' : modalType === 'APPROVE' ? 'Confirm Approval' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
