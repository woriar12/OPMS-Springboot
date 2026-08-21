import React, { useEffect, useState } from 'react';
import { studentService } from '../../services/studentService';
import { Calendar, Video, MapPin, Phone, Clock } from 'lucide-react';

export const StudentInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.getMyInterviews()
      .then(setInterviews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading interviews...</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>My Scheduled Interviews</h1>
        <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>View interview rounds and meeting details</p>
      </div>

      {interviews.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '48px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <Calendar size={36} color="#CBD5E1" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>No interviews scheduled yet</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {interviews.map(iv => (
            <div key={iv.id} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#7C3AED', background: '#F5F3FF', padding: '2px 8px', borderRadius: '100px' }}>
                  {iv.interviewType}
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '100px',
                  color: iv.result === 'PASSED' ? '#059669' : iv.result === 'FAILED' ? '#DC2626' : '#D97706',
                  background: iv.result === 'PASSED' ? '#ECFDF5' : iv.result === 'FAILED' ? '#FEF2F2' : '#FFFBEB'
                }}>
                  Result: {iv.result}
                </span>
              </div>

              <h3 style={{ margin: '0 0 2px', fontSize: '16px', fontWeight: 700, color: '#1E293B' }}>{iv.roundName}</h3>
              <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#64748B', fontWeight: 600 }}>{iv.companyName} — {iv.driveTitle}</p>

              <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>Date:</strong> {iv.scheduledDate} {iv.startTime ? `at ${iv.startTime}` : ''}</div>
                {iv.interviewer && <div><strong>Interviewer:</strong> {iv.interviewer}</div>}
                {iv.meetingLink && (
                  <div>
                    <strong>Link:</strong> <a href={iv.meetingLink} target="_blank" rel="noreferrer" style={{ color: '#2563EB', fontWeight: 600 }}>Join Meeting</a>
                  </div>
                )}
                {iv.location && <div><strong>Location:</strong> {iv.location}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
