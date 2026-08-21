import React, { useEffect, useState } from 'react';
import { studentService } from '../../services/studentService';
import { Award, CheckCircle, XCircle, FileText } from 'lucide-react';

export const StudentOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOffer, setModalOffer] = useState(null);
  const [responseType, setResponseType] = useState('ACCEPT');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    studentService.getMyOffers()
      .then(setOffers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRespond = async () => {
    if (!modalOffer) return;
    setSubmitting(true);
    try {
      const updated = await studentService.respondToOffer(modalOffer.id, { response: responseType, comment });
      setOffers(prev => prev.map(o => o.id === modalOffer.id ? updated : o));
      setModalOffer(null);
      setComment('');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading offers...</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>My Job Offers</h1>
        <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>Review and respond to job offers received</p>
      </div>

      {offers.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '48px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <Award size={36} color="#CBD5E1" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>No job offers received yet</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {offers.map(o => (
            <div key={o.id} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '100px' }}>
                    Offer #{o.offerNumber}
                  </span>
                  <h3 style={{ margin: '6px 0 2px', fontSize: '18px', fontWeight: 700, color: '#1E293B' }}>{o.companyName}</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748B', fontWeight: 600 }}>{o.jobRole}</p>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#374151', display: 'flex', flexDirection: 'column', gap: '8px', margin: '16px 0', background: '#F8FAFC', padding: '12px', borderRadius: '10px' }}>
                <div><strong>CTC Package:</strong> <span style={{ color: '#059669', fontWeight: 700 }}>₹{o.ctc} LPA</span></div>
                <div><strong>Joining Location:</strong> {o.joiningLocation || '—'}</div>
                <div><strong>Joining Date:</strong> {o.joiningDate || 'TBD'}</div>
                <div><strong>Status:</strong> <span style={{ fontWeight: 600 }}>{o.status}</span></div>
              </div>

              {o.status === 'SENT' || o.status === 'GENERATED' ? (
                <button onClick={() => setModalOffer(o)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#059669,#10B981)', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                  Respond to Offer (Accept / Decline)
                </button>
              ) : (
                <div style={{ textAlign: 'center', padding: '8px', background: o.status === 'ACCEPTED' ? '#ECFDF5' : '#FEF2F2', borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: o.status === 'ACCEPTED' ? '#059669' : '#DC2626' }}>
                  Offer {o.status}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      {modalOffer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 700, color: '#1E293B' }}>Respond to Job Offer</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748B' }}>Offer from <strong>{modalOffer.companyName}</strong> for ₹{modalOffer.ctc} LPA</p>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <button type="button" onClick={() => setResponseType('ACCEPT')} style={{
                flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid',
                borderColor: responseType === 'ACCEPT' ? '#059669' : '#E2E8F0',
                background: responseType === 'ACCEPT' ? '#ECFDF5' : '#fff',
                color: responseType === 'ACCEPT' ? '#059669' : '#475569',
                fontWeight: 700, fontSize: '13px', cursor: 'pointer'
              }}>
                Accept Offer
              </button>
              <button type="button" onClick={() => setResponseType('DECLINE')} style={{
                flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid',
                borderColor: responseType === 'DECLINE' ? '#DC2626' : '#E2E8F0',
                background: responseType === 'DECLINE' ? '#FEF2F2' : '#fff',
                color: responseType === 'DECLINE' ? '#DC2626' : '#475569',
                fontWeight: 700, fontSize: '13px', cursor: 'pointer'
              }}>
                Decline Offer
              </button>
            </div>

            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Comments / Message (optional)</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Add any comments..."
              style={{ width: '100%', marginTop: '6px', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button onClick={() => setModalOffer(null)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
              <button onClick={handleRespond} disabled={submitting} style={{
                padding: '8px 18px', borderRadius: '10px', border: 'none',
                background: responseType === 'ACCEPT' ? '#059669' : '#DC2626',
                color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer'
              }}>
                {submitting ? 'Submitting...' : 'Confirm Response'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
