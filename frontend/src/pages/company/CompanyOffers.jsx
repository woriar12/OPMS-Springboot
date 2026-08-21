import React, { useEffect, useState } from 'react';
import { companyService } from '../../services/companyService';
import { Award, CheckCircle, XCircle } from 'lucide-react';

export const CompanyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyService.getCompanyOffers()
      .then(setOffers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading offers...</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>Issued Offers</h1>
        <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>Track job offers extended to candidates</p>
      </div>

      {offers.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '48px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <Award size={36} color="#CBD5E1" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>No offers issued yet</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Offer No', 'Candidate', 'Register No', 'Job Role', 'Package (CTC)', 'Joining Date', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {offers.map((o, i) => (
                <tr key={o.id} style={{ borderBottom: i < offers.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <td style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, color: '#7C3AED' }}>#{o.offerNumber}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{o.studentName}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{o.registerNumber}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{o.jobRole}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 700, color: '#059669' }}>₹{o.ctc} LPA</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{o.joiningDate || 'TBD'}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
                      color: o.status === 'ACCEPTED' ? '#059669' : o.status === 'DECLINED' ? '#DC2626' : '#2563EB',
                      background: o.status === 'ACCEPTED' ? '#ECFDF5' : o.status === 'DECLINED' ? '#FEF2F2' : '#EFF6FF'
                    }}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
