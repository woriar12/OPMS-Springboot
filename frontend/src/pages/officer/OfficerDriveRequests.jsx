import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { officerService } from '../../services/officerService';
import { Eye, CheckCircle, XCircle, Briefcase, Search } from 'lucide-react';

const statusColors = {
  DRAFT: { color: '#64748B', bg: '#F1F5F9' },
  PENDING_APPROVAL: { color: '#D97706', bg: '#FFFBEB' },
  APPROVED: { color: '#059669', bg: '#ECFDF5' },
  ACTIVE: { color: '#2563EB', bg: '#EFF6FF' },
  CLOSED: { color: '#64748B', bg: '#F1F5F9' },
  REJECTED: { color: '#DC2626', bg: '#FEF2F2' },
  CANCELLED: { color: '#6B7280', bg: '#F9FAFB' },
};

const Badge = ({ status }) => {
  const s = statusColors[status] || statusColors.DRAFT;
  return <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, color: s.color, background: s.bg }}>{status?.replace('_', ' ')}</span>;
};

export const OfficerDriveRequests = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [approveModal, setApproveModal] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    officerService.getPendingDrives().then(setDrives).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = drives.filter(d =>
    d.title?.toLowerCase().includes(search.toLowerCase()) ||
    d.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    d.jobRole?.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await officerService.approveDrive(approveModal.id, {});
      setDrives(prev => prev.filter(d => d.id !== approveModal.id));
      setApproveModal(null);
    } catch (e) { alert(e.response?.data?.message || 'Failed'); }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!reason.trim()) { alert('Rejection reason is required'); return; }
    setActionLoading(true);
    try {
      await officerService.rejectDrive(rejectModal.id, { rejectionReason: reason });
      setDrives(prev => prev.filter(d => d.id !== rejectModal.id));
      setRejectModal(null); setReason('');
    } catch (e) { alert(e.response?.data?.message || 'Failed'); }
    setActionLoading(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>Drive Approval Requests</h1>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>{drives.length} drives pending approval</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drives..."
            style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '13px', outline: 'none', minWidth: '200px' }} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '48px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <Briefcase size={36} color="#CBD5E1" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>No pending drive requests</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Company', 'Drive Title', 'Job Role', 'Departments', 'CGPA', 'Deadline', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{d.companyName}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#374151' }}>{d.title}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{d.jobRole}</td>
                  <td style={{ padding: '12px 14px', fontSize: '11px', color: '#374151' }}>
                    {d.eligibleDepartments?.map(dep => dep.departmentCode).join(', ') || 'All'}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{d.minimumCgpa ?? '—'}</td>
                  <td style={{ padding: '12px 14px', fontSize: '11px', color: '#94A3B8' }}>{d.applicationDeadline || '—'}</td>
                  <td style={{ padding: '12px 14px' }}><Badge status={d.status} /></td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => navigate(`/officer/drives/${d.id}`)}
                        style={{ padding: '5px 8px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', cursor: 'pointer', fontSize: '11px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Eye size={11} /> View
                      </button>
                      <button onClick={() => setApproveModal(d)}
                        style={{ padding: '5px 8px', borderRadius: '8px', border: 'none', background: '#059669', cursor: 'pointer', fontSize: '11px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <CheckCircle size={11} /> Approve
                      </button>
                      <button onClick={() => setRejectModal(d)}
                        style={{ padding: '5px 8px', borderRadius: '8px', border: 'none', background: '#DC2626', cursor: 'pointer', fontSize: '11px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <XCircle size={11} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {approveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '400px' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700 }}>Approve Drive</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748B' }}>Approving: <strong>{approveModal.title}</strong> by {approveModal.companyName}</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setApproveModal(null)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
              <button onClick={handleApprove} disabled={actionLoading} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#059669', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                {actionLoading ? 'Approving...' : 'Approve Drive'}
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '420px' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700 }}>Reject Drive</h3>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#DC2626' }}>Rejection Reason *</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
              placeholder="Enter reason..."
              style={{ width: '100%', marginTop: '6px', padding: '10px', border: '1px solid #FECACA', borderRadius: '10px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setRejectModal(null); setReason(''); }} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
              <button onClick={handleReject} disabled={actionLoading} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#DC2626', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                {actionLoading ? 'Rejecting...' : 'Reject Drive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
