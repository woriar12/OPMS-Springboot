import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { officerService } from '../../services/officerService';
import { ArrowLeft, Briefcase, Building2, MapPin, Calendar, CheckCircle, XCircle } from 'lucide-react';

const Field = ({ label, value }) => (
  <div style={{ marginBottom: '12px' }}>
    <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>{label}</p>
    <p style={{ margin: '3px 0 0', fontSize: '14px', color: '#1E293B', fontWeight: 500 }}>{value || '—'}</p>
  </div>
);

const statusColors = {
  DRAFT: { color: '#64748B', bg: '#F1F5F9' },
  PENDING_APPROVAL: { color: '#D97706', bg: '#FFFBEB' },
  APPROVED: { color: '#059669', bg: '#ECFDF5' },
  ACTIVE: { color: '#2563EB', bg: '#EFF6FF' },
  REJECTED: { color: '#DC2626', bg: '#FEF2F2' },
  CLOSED: { color: '#64748B', bg: '#F1F5F9' },
};

export const OfficerDriveDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(false);
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    officerService.getDriveById(id).then(setDrive).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const updated = await officerService.approveDrive(id, {});
      setDrive(updated);
    } catch (e) { alert(e.response?.data?.message || 'Failed'); }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!reason.trim()) { alert('Rejection reason is required'); return; }
    setActionLoading(true);
    try {
      const updated = await officerService.rejectDrive(id, { rejectionReason: reason });
      setDrive(updated); setRejectModal(false); setReason('');
    } catch (e) { alert(e.response?.data?.message || 'Failed'); }
    setActionLoading(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading...</div>;
  if (!drive) return <div style={{ textAlign: 'center', padding: '60px', color: '#EF4444' }}>Drive not found</div>;

  const s = statusColors[drive.status] || statusColors.DRAFT;

  return (
    <div style={{ maxWidth: '900px' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
        <ArrowLeft size={14} /> Back
      </button>

      {/* Header */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, color: s.color, background: s.bg }}>{drive.status?.replace('_', ' ')}</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>{drive.title}</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>{drive.companyName} · {drive.jobRole}</p>
        </div>
        {drive.status === 'PENDING_APPROVAL' && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleApprove} disabled={actionLoading}
              style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#059669', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={14} /> {actionLoading ? 'Processing...' : 'Approve'}
            </button>
            <button onClick={() => setRejectModal(true)}
              style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#DC2626', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <XCircle size={14} /> Reject
            </button>
          </div>
        )}
      </div>

      {drive.rejectionReason && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#DC2626' }}>
          <strong>Rejection Reason:</strong> {drive.rejectionReason}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '13px', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Briefcase size={14} color="#2563EB" /> Job Details
          </h3>
          <Field label="Job Type" value={drive.jobType} />
          <Field label="Location" value={drive.location} />
          <Field label="Work Mode" value={drive.workMode} />
          <Field label="Industry" value={drive.industry} />
          <Field label="Salary" value={drive.salaryDescription || (drive.salaryMin && drive.salaryMax ? `₹${drive.salaryMin}L – ₹${drive.salaryMax}L` : null)} />
        </div>

        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Eligibility Criteria</h3>
          <Field label="Minimum CGPA" value={drive.minimumCgpa} />
          <Field label="Max Backlogs" value={drive.maximumBacklogs} />
          <Field label="Graduation Batch" value={drive.graduationBatch} />
          <Field label="Eligible Departments" value={drive.eligibleDepartments?.map(d => d.departmentCode).join(', ') || 'All Departments'} />
          <Field label="Required Skills" value={drive.requiredSkills} />
        </div>

        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '13px', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="#2563EB" /> Timeline
          </h3>
          <Field label="Application Start" value={drive.applicationStartDate} />
          <Field label="Application Deadline" value={drive.applicationDeadline} />
          <Field label="Drive Date" value={drive.driveDate} />
        </div>

        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Description</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>{drive.description || '—'}</p>
        </div>
      </div>

      {rejectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '420px' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700 }}>Reject Drive</h3>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#DC2626' }}>Rejection Reason *</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
              placeholder="Enter reason..."
              style={{ width: '100%', marginTop: '6px', padding: '10px', border: '1px solid #FECACA', borderRadius: '10px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setRejectModal(false); setReason(''); }} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
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
