import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { ArrowLeft, Briefcase, Calendar, CheckCircle, Send, AlertCircle } from 'lucide-react';

export const StudentDriveDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    Promise.all([
      studentService.getDriveById(id),
      studentService.getMyApplications(),
      studentService.getMyProfile()
    ]).then(([driveData, myApps, profileData]) => {
      setDrive(driveData);
      const isAlreadyApplied = myApps.some(app => app.driveId === parseInt(id));
      setApplied(isAlreadyApplied);
      setProfile(profileData);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setError('');
    try {
      await studentService.applyForDrive(id, { coverLetter });
      setApplied(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setError('You have already applied for this placement drive.');
        setApplied(true);
      } else {
        setError(err.response?.data?.message || 'Failed to submit application');
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading drive details...</div>;
  if (!drive) return <div style={{ textAlign: 'center', padding: '60px', color: '#EF4444' }}>Drive not found</div>;

  return (
    <div style={{ maxWidth: '850px' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
        <ArrowLeft size={14} /> Back to Drives
      </button>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#DC2626', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Drive Header */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, color: '#2563EB', background: '#EFF6FF', display: 'inline-block', marginBottom: '6px' }}>
            {drive.jobType || 'Full Time'}
          </span>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1E293B' }}>{drive.title}</h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748B', fontWeight: 600 }}>{drive.companyName} · {drive.jobRole}</p>
        </div>

        {applied ? (
          <div style={{ padding: '10px 18px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', color: '#059669', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={16} /> Application Submitted
          </div>
        ) : (
          <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#2563EB,#4F46E5)', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Send size={15} /> Apply Now
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '13px', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>Job Overview</h3>
          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px', color: '#374151' }}>
            <div><strong>Location:</strong> {drive.location || '—'}</div>
            <div><strong>Work Mode:</strong> {drive.workMode || '—'}</div>
            <div><strong>Package:</strong> {drive.salaryDescription || (drive.salaryMin ? `₹${drive.salaryMin}L – ₹${drive.salaryMax}L` : 'As per industry standard')}</div>
            <div><strong>Industry:</strong> {drive.industry || '—'}</div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '13px', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>Eligibility Criteria</h3>
          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px', color: '#374151' }}>
            <div><strong>Minimum CGPA:</strong> {drive.minimumCgpa ?? '0.0'}</div>
            <div><strong>Max Active Backlogs:</strong> {drive.maximumBacklogs ?? '0'}</div>
            <div><strong>Batch:</strong> {drive.graduationBatch || 'All'}</div>
            <div><strong>Required Skills:</strong> {drive.requiredSkills || 'Not specified'}</div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', gridColumn: '1 / -1' }}>
          <h3 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>Job Description</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>{drive.description || 'No detailed description provided.'}</p>
        </div>
      </div>

      {/* Apply Form */}
      {!applied && (
        <form onSubmit={handleApply} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 700, color: '#1E293B' }}>Submit Application</h3>
          
          {!profile?.resumeUrl ? (
            <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '12px', padding: '16px', color: '#92400E', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} color="#D97706" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '2px' }}>Resume Mandatory to Apply!</strong>
                  You must upload or link your Resume in your Profile before applying for placement drives.
                </div>
              </div>
              <button type="button" onClick={() => navigate('/student/profile')} style={{ padding: '8px 14px', background: '#D97706', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}>
                Go to My Profile ➔
              </button>
            </div>
          ) : (
            <>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748B' }}>Your master academic data & resume snapshot will be attached automatically.</p>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Cover Letter / Note (optional)</label>
              <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={3} placeholder="Add a short note to the recruiter..."
                style={{ width: '100%', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: '16px' }} />

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={applying}
                  style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#2563EB,#4F46E5)', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                  {applying ? 'Submitting...' : 'Confirm & Submit Application'}
                </button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
};
