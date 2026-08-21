import React, { useEffect, useState } from 'react';
import { companyService } from '../../services/companyService';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

export const CompanyInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultModal, setResultModal] = useState(null);
  const [resultVal, setResultVal] = useState('PASSED');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    companyService.getCompanyInterviews()
      .then(setInterviews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateResult = async () => {
    if (!resultModal) return;
    setSubmitting(true);
    try {
      const updated = await companyService.updateInterviewResult(resultModal.id, { result: resultVal });
      setInterviews(prev => prev.map(i => i.id === resultModal.id ? updated : i));
      setResultModal(null);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update result');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading interviews...</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>Interview Management</h1>
        <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>Track candidate interviews and update evaluation results</p>
      </div>

      {interviews.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '48px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <Calendar size={36} color="#CBD5E1" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>No interviews scheduled yet</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Candidate', 'Register No', 'Drive Title', 'Round', 'Type', 'Scheduled Date', 'Result', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {interviews.map((iv, i) => (
                <tr key={iv.id} style={{ borderBottom: i < interviews.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{iv.studentName}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{iv.registerNumber}</td>
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
                  <td style={{ padding: '12px 14px' }}>
                    {iv.result === 'PENDING' && (
                      <button onClick={() => setResultModal(iv)}
                        style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', cursor: 'pointer', fontSize: '11px', fontWeight: 600, color: '#374151' }}>
                        Update Result
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {resultModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '380px' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700 }}>Record Interview Result</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748B' }}>{resultModal.studentName} — {resultModal.roundName}</p>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button type="button" onClick={() => setResultVal('PASSED')} style={{
                flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid',
                borderColor: resultVal === 'PASSED' ? '#059669' : '#E2E8F0',
                background: resultVal === 'PASSED' ? '#ECFDF5' : '#fff', color: resultVal === 'PASSED' ? '#059669' : '#475569',
                fontWeight: 700, fontSize: '13px', cursor: 'pointer'
              }}>PASSED</button>
              <button type="button" onClick={() => setResultVal('FAILED')} style={{
                flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid',
                borderColor: resultVal === 'FAILED' ? '#DC2626' : '#E2E8F0',
                background: resultVal === 'FAILED' ? '#FEF2F2' : '#fff', color: resultVal === 'FAILED' ? '#DC2626' : '#475569',
                fontWeight: 700, fontSize: '13px', cursor: 'pointer'
              }}>FAILED</button>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setResultModal(null)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
              <button onClick={handleUpdateResult} disabled={submitting} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#7C3AED', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                {submitting ? 'Saving...' : 'Save Result'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
