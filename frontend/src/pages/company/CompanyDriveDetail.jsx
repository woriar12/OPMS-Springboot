import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import { CompanyDriveEditModal } from './CompanyDriveEditModal';
import { ArrowLeft, Briefcase, Calendar, CheckCircle, Send, AlertCircle, Edit } from 'lucide-react';

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

export const CompanyDriveDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchDrive();
  }, [id]);

  const fetchDrive = () => {
    setLoading(true);
    companyService.getDriveById(id).then(setDrive).catch(console.error).finally(() => setLoading(false));
  };

  const handleSubmitDrive = async () => {
    setSubmitting(true);
    try {
      const updated = await companyService.submitDrive(id);
      setDrive(updated);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to submit drive');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDriveUpdated = (updatedDrive) => {
    setDrive(updatedDrive);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading drive...</div>;
  if (!drive) return <div style={{ textAlign: 'center', padding: '60px', color: '#EF4444' }}>Drive not found</div>;

  const s = statusColors[drive.status] || statusColors.DRAFT;

  return (
    <div style={{ maxWidth: '850px' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
        <ArrowLeft size={14} /> Back
      </button>

      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, color: s.color, background: s.bg, display: 'inline-block', marginBottom: '6px' }}>
            {drive.status?.replace('_', ' ')}
          </span>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>{drive.title}</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>{drive.jobRole}</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setIsEditModalOpen(true)}
            style={{ padding: '9px 16px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#EFF6FF', color: '#2563EB', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Edit size={14} /> Edit Drive
          </button>
          {drive.status === 'DRAFT' && (
            <button onClick={handleSubmitDrive} disabled={submitting}
              style={{ padding: '9px 18px', borderRadius: '10px', border: 'none', background: '#7C3AED', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Send size={14} /> {submitting ? 'Submitting...' : 'Submit for Officer Approval'}
            </button>
          )}
        </div>
      </div>

      {drive.status === 'REJECTED' && drive.rejectionReason && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', display: 'flex', gap: '10px' }}>
          <AlertCircle size={16} color="#DC2626" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, fontWeight: 600, color: '#991B1B', fontSize: '13px' }}>Drive Rejected by Placement Officer</p>
            <p style={{ margin: '2px 0 0', color: '#7F1D1D', fontSize: '12px' }}>Reason: {drive.rejectionReason}</p>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '13px', fontWeight: 700, color: '#1E293B', textTransform: 'uppercase' }}>Job Details</h3>
          <Field label="Industry" value={drive.industry} />
          <Field label="Job Type" value={drive.jobType?.replace('_', ' ')} />
          <Field label="Location" value={drive.location} />
          <Field label="Work Mode" value={drive.workMode?.replace('_', ' ')} />
        </div>

        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '13px', fontWeight: 700, color: '#1E293B', textTransform: 'uppercase' }}>Eligibility Criteria</h3>
          <Field label="Minimum CGPA" value={drive.minimumCgpa != null ? `${drive.minimumCgpa} CGPA` : null} />
          <Field label="Max Backlogs Allowed" value={drive.maximumBacklogs != null ? `${drive.maximumBacklogs} Backlogs` : null} />
          <Field label="Graduation Batch" value={drive.graduationBatch} />
          <Field label="Target Departments" value={drive.eligibleDepartments?.map(d => d.departmentCode).join(', ') || 'All Departments'} />
        </div>

        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '13px', fontWeight: 700, color: '#1E293B', textTransform: 'uppercase' }}>Compensation & Dates</h3>
          <Field label="Salary Range" value={drive.salaryMin && drive.salaryMax ? `₹${drive.salaryMin} - ₹${drive.salaryMax} LPA` : drive.salaryDescription} />
          <Field label="Application Deadline" value={drive.applicationDeadline} />
          <Field label="Drive Date" value={drive.driveDate} />
        </div>
      </div>

      {drive.description && (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: '#1E293B', textTransform: 'uppercase' }}>Description</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{drive.description}</p>
        </div>
      )}

      {/* Edit Modal */}
      <CompanyDriveEditModal
        drive={drive}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onDriveUpdated={handleDriveUpdated}
      />
    </div>
  );
};
