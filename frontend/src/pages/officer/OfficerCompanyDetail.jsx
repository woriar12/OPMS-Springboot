import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { officerService } from '../../services/officerService';
import { ArrowLeft, Building2, Mail, Phone, Globe, MapPin, User, CheckCircle, XCircle } from 'lucide-react';

const statusColors = {
  PENDING: { color: '#D97706', bg: '#FFFBEB' },
  APPROVED: { color: '#059669', bg: '#ECFDF5' },
  REJECTED: { color: '#DC2626', bg: '#FEF2F2' },
  SUSPENDED: { color: '#7C3AED', bg: '#F5F3FF' },
};

const Field = ({ label, value }) => (
  <div style={{ marginBottom: '12px' }}>
    <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
    <p style={{ margin: '3px 0 0', fontSize: '14px', color: '#1E293B', fontWeight: 500 }}>{value || '—'}</p>
  </div>
);

export const OfficerCompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [comment, setComment] = useState('');
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id && id !== 'undefined') {
      officerService.getCompanyById(id).then(setCompany).catch(console.error).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const updated = await officerService.approveCompany(id, { comment });
      setCompany(updated);
      setApproveModal(false); setComment('');
    } catch (e) { alert(e.response?.data?.message || 'Failed'); }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!reason.trim()) { alert('Rejection reason is required'); return; }
    setActionLoading(true);
    try {
      const updated = await officerService.rejectCompany(id, { rejectionReason: reason });
      setCompany(updated);
      setRejectModal(false); setReason('');
    } catch (e) { alert(e.response?.data?.message || 'Failed'); }
    setActionLoading(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading...</div>;
  if (!company) return <div style={{ textAlign: 'center', padding: '60px', color: '#EF4444' }}>Company not found</div>;

  const s = statusColors[company.status] || statusColors.PENDING;

  return (
    <div style={{ maxWidth: '860px' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
        <ArrowLeft size={14} /> Back
      </button>

      {/* Header */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {company.logoUrl ? <img src={company.logoUrl} alt="logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} /> : <Building2 size={24} color="#2563EB" />}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>{company.companyName}</h1>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>{company.industry}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, color: s.color, background: s.bg }}>
            {company.status}
          </span>
          {company.status === 'PENDING' && (
            <>
              <button onClick={() => setApproveModal(true)} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#059669', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} /> Approve
              </button>
              <button onClick={() => setRejectModal(true)} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#DC2626', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <XCircle size={14} /> Reject
              </button>
            </>
          )}
        </div>
      </div>

      {company.status === 'REJECTED' && company.rejectionReason && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#DC2626' }}>
          <strong>Rejection Reason:</strong> {company.rejectionReason}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Company Info */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '13px', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={14} color="#2563EB" /> Company Information
          </h3>
          <Field label="Company Name" value={company.companyName} />
          <Field label="Industry" value={company.industry} />
          <Field label="Website" value={company.website} />
          <Field label="Description" value={company.description} />
        </div>

        {/* Contact Info */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '13px', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={14} color="#2563EB" /> HR Contact Details
          </h3>
          <Field label="Contact Person" value={company.hrContactPerson} />
          <Field label="Designation" value={company.designation} />
          <Field label="HR Email" value={company.hrEmail} />
          <Field label="Phone" value={company.phone} />
        </div>

        {/* Location */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', gridColumn: '1 / -1' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '13px', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="#2563EB" /> Address
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <Field label="Address" value={company.address} />
            <Field label="City" value={company.city} />
            <Field label="State" value={company.state} />
            <Field label="Country" value={company.country} />
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {approveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '420px' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700 }}>Approve Company</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748B' }}>Credentials will be generated and emailed to <strong>{company.hrEmail}</strong></p>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Comment (optional)</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
              placeholder="Add a comment..." style={{ width: '100%', marginTop: '6px', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button onClick={() => setApproveModal(false)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>Cancel</button>
              <button onClick={handleApprove} disabled={actionLoading} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#059669', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                {actionLoading ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '420px' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700 }}>Reject Company</h3>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#DC2626' }}>Rejection Reason *</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
              placeholder="Enter reason..." style={{ width: '100%', marginTop: '6px', padding: '10px', border: '1px solid #FECACA', borderRadius: '10px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button onClick={() => setRejectModal(false)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>Cancel</button>
              <button onClick={handleReject} disabled={actionLoading} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#DC2626', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
