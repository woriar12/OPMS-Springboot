import React, { useEffect, useState } from 'react';
import { officerService } from '../../services/officerService';
import { Calendar } from 'lucide-react';

export const OfficerInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    officerService.getAllInterviews().then(setInterviews).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading interviews...</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>All Conducted & Scheduled Interviews</h1>
        <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>Monitoring interview rounds across companies</p>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {['Candidate', 'Register No', 'Company', 'Drive Title', 'Round', 'Type', 'Scheduled Date', 'Result'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {interviews.map((iv, i) => (
              <tr key={iv.id} style={{ borderBottom: i < interviews.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{iv.studentName}</td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{iv.registerNumber}</td>
                <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{iv.companyName}</td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{iv.driveTitle}</td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{iv.roundName}</td>
                <td style={{ padding: '12px 14px', fontSize: '11px', color: '#64748B' }}>{iv.interviewType}</td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{iv.scheduledDate}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
                    color: iv.result === 'PASSED' ? '#059669' : iv.result === 'FAILED' ? '#DC2626' : '#D97706',
                    background: iv.result === 'PASSED' ? '#ECFDF5' : iv.result === 'FAILED' ? '#FEF2F2' : '#FFFBEB'
                  }}>
                    {iv.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
