import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import { ArrowLeft, User, FileText, CheckCircle, XCircle, Calendar, Award, ExternalLink } from 'lucide-react';

const statusColors = {
  APPLIED: { color: '#2563EB', bg: '#EFF6FF' },
  SHORTLISTED: { color: '#7C3AED', bg: '#F5F3FF' },
  INTERVIEW_SCHEDULED: { color: '#0891B2', bg: '#ECFEFF' },
  SELECTED: { color: '#059669', bg: '#ECFDF5' },
  REJECTED: { color: '#DC2626', bg: '#FEF2F2' },
  OFFERED: { color: '#059669', bg: '#ECFDF5' },
  PLACED: { color: '#059669', bg: '#ECFDF5' },
};

export const CompanyApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals
  const [interviewModal, setInterviewModal] = useState(false);
  const [offerModal, setOfferModal] = useState(false);

  // Forms
  const [interviewForm, setInterviewForm] = useState({
    roundName: 'Technical Round 1',
    interviewType: 'ONLINE',
    scheduledDate: '',
    startTime: '10:00',
    endTime: '11:00',
    meetingLink: '',
    interviewer: '',
    notes: '',
  });

  const [offerForm, setOfferForm] = useState({
    jobRole: '',
    ctc: '',
    joiningDate: '',
    joiningLocation: '',
    offerLetterUrl: '',
  });

  useEffect(() => {
    companyService.getApplicationById(id)
      .then(res => {
        setApp(res);
        setOfferForm(prev => ({ ...prev, jobRole: res.jobRole || '' }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleShortlist = async () => {
    setActionLoading(true);
    try {
      const updated = await companyService.shortlistApplication(id, { comment: 'Shortlisted by HR' });
      setApp(updated);
    } catch (e) { alert(e.response?.data?.message || 'Failed'); }
    setActionLoading(false);
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      const updated = await companyService.rejectApplication(id, { reason: 'Did not meet technical requirements' });
      setApp(updated);
    } catch (e) { alert(e.response?.data?.message || 'Failed'); }
    setActionLoading(false);
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await companyService.scheduleInterview(id, interviewForm);
      const updated = await companyService.getApplicationById(id);
      setApp(updated);
      setInterviewModal(false);
    } catch (e) { alert(e.response?.data?.message || 'Failed'); }
    setActionLoading(false);
  };

  const handleGenerateOffer = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await companyService.generateOffer(id, {
        ...offerForm,
        ctc: parseFloat(offerForm.ctc),
      });
      const updated = await companyService.getApplicationById(id);
      setApp(updated);
      setOfferModal(false);
    } catch (e) { alert(e.response?.data?.message || 'Failed'); }
    setActionLoading(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading candidate application...</div>;
  if (!app) return <div style={{ textAlign: 'center', padding: '60px', color: '#EF4444' }}>Application not found</div>;

  const s = statusColors[app.status] || statusColors.APPLIED;

  return (
    <div style={{ maxWidth: '850px' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
        <ArrowLeft size={14} /> Back
      </button>

      {/* Header */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, color: s.color, background: s.bg, display: 'inline-block', marginBottom: '6px' }}>
            {app.status?.replace('_', ' ')}
          </span>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>{app.studentName}</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>{app.registerNumber} · {app.departmentName} ({app.departmentCode})</p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {app.status === 'APPLIED' && (
            <>
              <button onClick={handleShortlist} disabled={actionLoading}
                style={{ padding: '8px 14px', borderRadius: '10px', border: 'none', background: '#7C3AED', color: '#fff', fontWeight: 600, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={14} /> Shortlist Candidate
              </button>
              <button onClick={handleReject} disabled={actionLoading}
                style={{ padding: '8px 14px', borderRadius: '10px', border: 'none', background: '#DC2626', color: '#fff', fontWeight: 600, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <XCircle size={14} /> Reject
              </button>
            </>
          )}

          {(app.status === 'SHORTLISTED' || app.status === 'INTERVIEW_SCHEDULED') && (
            <button onClick={() => setInterviewModal(true)}
              style={{ padding: '8px 14px', borderRadius: '10px', border: 'none', background: '#0891B2', color: '#fff', fontWeight: 600, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} /> Schedule Interview Round
            </button>
          )}

          {(app.status === 'INTERVIEWED' || app.status === 'SELECTED' || app.status === 'SHORTLISTED') && (
            <button onClick={() => setOfferModal(true)}
              style={{ padding: '8px 14px', borderRadius: '10px', border: 'none', background: '#059669', color: '#fff', fontWeight: 600, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Award size={14} /> Issue Job Offer
            </button>
          )}
        </div>
      </div>

      {/* Candidate Profile Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '13px', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>Academic Credentials</h3>
          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#374151' }}>
            <div><strong>CGPA:</strong> <span style={{ color: '#2563EB', fontWeight: 700 }}>{app.cgpa ?? '0.0'}</span></div>
            <div><strong>Active Backlogs:</strong> {app.activeBacklogs ?? 0}</div>
            <div><strong>Roll Number:</strong> {app.rollNumber || '—'}</div>
            <div><strong>Email:</strong> {app.studentEmail}</div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '13px', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>Drive Details</h3>
          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#374151' }}>
            <div><strong>Drive Title:</strong> {app.driveTitle}</div>
            <div><strong>Job Role:</strong> {app.jobRole}</div>
            <div><strong>Applied Date:</strong> {app.appliedAt ? new Date(app.appliedAt).toLocaleString() : '—'}</div>
            {app.resumeSnapshotUrl && (
              <div>
                <strong>Resume:</strong> <a href={app.resumeSnapshotUrl} target="_blank" rel="noreferrer" style={{ color: '#2563EB', fontWeight: 600 }}>View Resume Link <ExternalLink size={12} /></a>
              </div>
            )}
          </div>
        </div>

        {app.coverLetter && (
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', gridColumn: '1 / -1' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>Cover Note / Message</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#374151' }}>{app.coverLetter}</p>
          </div>
        )}
      </div>

      {/* Schedule Interview Modal */}
      {interviewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleScheduleInterview} style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Schedule Interview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Round Name *</label>
                <input required value={interviewForm.roundName} onChange={e => setInterviewForm({ ...interviewForm, roundName: e.target.value })} placeholder="e.g. Technical Round 1"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Type</label>
                  <select value={interviewForm.interviewType} onChange={e => setInterviewForm({ ...interviewForm, interviewType: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                    <option value="ONLINE">ONLINE</option>
                    <option value="OFFLINE">OFFLINE</option>
                    <option value="PHONE">PHONE</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Date *</label>
                  <input type="date" required value={interviewForm.scheduledDate} onChange={e => setInterviewForm({ ...interviewForm, scheduledDate: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Meeting Link / Venue</label>
                <input value={interviewForm.meetingLink} onChange={e => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })} placeholder="https://meet.google.com/..."
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Interviewer</label>
                <input value={interviewForm.interviewer} onChange={e => setInterviewForm({ ...interviewForm, interviewer: e.target.value })} placeholder="e.g. Sr. Tech Lead"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setInterviewModal(false)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
              <button type="submit" disabled={actionLoading} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#0891B2', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                {actionLoading ? 'Scheduling...' : 'Schedule Interview'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Generate Offer Modal */}
      {offerModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleGenerateOffer} style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Issue Job Offer</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Job Role *</label>
                <input required value={offerForm.jobRole} onChange={e => setOfferForm({ ...offerForm, jobRole: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>CTC Package (LPA) *</label>
                <input type="number" step="0.1" required value={offerForm.ctc} onChange={e => setOfferForm({ ...offerForm, ctc: e.target.value })} placeholder="e.g. 8.5"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Joining Date</label>
                  <input type="date" value={offerForm.joiningDate} onChange={e => setOfferForm({ ...offerForm, joiningDate: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Joining Location</label>
                  <input value={offerForm.joiningLocation} onChange={e => setOfferForm({ ...offerForm, joiningLocation: e.target.value })} placeholder="Bangalore"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setOfferModal(false)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
              <button type="submit" disabled={actionLoading} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#059669', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                {actionLoading ? 'Generating...' : 'Issue Offer'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
