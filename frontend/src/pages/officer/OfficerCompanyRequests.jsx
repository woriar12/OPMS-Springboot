import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { officerService } from '../../services/officerService';
import { Eye, CheckCircle, XCircle, Clock, Building2, Search } from 'lucide-react';

const statusColors = {
  PENDING: { color: '#D97706', bg: '#FFFBEB', label: 'Pending' },
  APPROVED: { color: '#059669', bg: '#ECFDF5', label: 'Approved' },
  REJECTED: { color: '#DC2626', bg: '#FEF2F2', label: 'Rejected' },
  SUSPENDED: { color: '#7C3AED', bg: '#F5F3FF', label: 'Suspended' },
};

const Badge = ({ status }) => {
  const s = statusColors[status] || statusColors.PENDING;
  return (
    <span style={{
      padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
      color: s.color, background: s.bg,
    }}>{s.label}</span>
  );
};

export const OfficerCompanyRequests = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [approveModal, setApproveModal] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [comment, setComment] = useState('');
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    officerService.getPendingCompanies()
      .then(setCompanies)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = companies.filter(c =>
    c.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    c.industry?.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await officerService.approveCompany(approveModal.id, { comment });
      setCompanies(prev => prev.filter(c => c.id !== approveModal.id));
      setApproveModal(null); setComment('');
    } catch (e) { alert(e.response?.data?.message || 'Failed to approve'); }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!reason.trim()) { alert('Rejection reason is required'); return; }
    setActionLoading(true);
    try {
      await officerService.rejectCompany(rejectModal.id, { rejectionReason: reason });
      setCompanies(prev => prev.filter(c => c.id !== rejectModal.id));
      setRejectModal(null); setReason('');
    } catch (e) { alert(e.response?.data?.message || 'Failed to reject'); }
    setActionLoading(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>Pending Company Requests</h1>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>{companies.length} companies awaiting verification</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search companies..."
            style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '13px', outline: 'none', minWidth: '200px' }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '48px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <Building2 size={36} color="#CBD5E1" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>No pending company requests</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Company', 'Industry', 'HR Email', 'Phone', 'Registered', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: '#1E293B' }}>{c.companyName}</p>
                    {c.website && <p style={{ margin: '1px 0 0', fontSize: '11px', color: '#94A3B8' }}>{c.website}</p>}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#374151' }}>{c.industry}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{c.hrEmail}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{c.phone}</td>
                  <td style={{ padding: '12px 14px', fontSize: '11px', color: '#94A3B8' }}>
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '12px 14px' }}><Badge status={c.status} /></td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => navigate(`/officer/companies/${c.id}`)}
                        style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', cursor: 'pointer', fontSize: '11px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={12} /> View
                      </button>
                      <button onClick={() => setApproveModal(c)}
                        style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: '#059669', cursor: 'pointer', fontSize: '11px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={12} /> Approve
                      </button>
                      <button onClick={() => setRejectModal(c)}
                        style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: '#DC2626', cursor: 'pointer', fontSize: '11px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <XCircle size={12} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Approve Modal */}
      {approveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 700, color: '#1E293B' }}>Approve Company</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748B' }}>Approving <strong>{approveModal.companyName}</strong> — credentials will be generated and emailed.</p>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Comment (optional)</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
              placeholder="Add a comment..."
              style={{ width: '100%', marginTop: '6px', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setApproveModal(null); setComment(''); }}
                style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                Cancel
              </button>
              <button onClick={handleApprove} disabled={actionLoading}
                style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#059669', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                {actionLoading ? 'Approving...' : 'Approve & Send Credentials'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 700, color: '#1E293B' }}>Reject Company</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748B' }}>Rejecting <strong>{rejectModal.companyName}</strong></p>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#DC2626' }}>Rejection Reason <span>*</span></label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
              placeholder="Enter reason for rejection..."
              style={{ width: '100%', marginTop: '6px', padding: '10px', border: '1px solid #FECACA', borderRadius: '10px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setRejectModal(null); setReason(''); }}
                style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                Cancel
              </button>
              <button onClick={handleReject} disabled={actionLoading}
                style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#DC2626', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                {actionLoading ? 'Rejecting...' : 'Reject Company'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
