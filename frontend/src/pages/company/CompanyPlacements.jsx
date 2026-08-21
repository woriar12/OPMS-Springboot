import React, { useEffect, useState } from 'react';
import { companyService } from '../../services/companyService';
import { Award, CheckCircle2 } from 'lucide-react';

export const CompanyPlacements = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyService.getCompanyPlacements()
      .then(setPlacements)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading placements...</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>Placed Candidates</h1>
        <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>Confirmed student placements with accepted offers</p>
      </div>

      {placements.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '48px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <CheckCircle2 size={36} color="#CBD5E1" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>No confirmed placements yet</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Candidate Name', 'Register No', 'Department', 'Job Role', 'Package', 'Joining Date', 'Placement Date'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {placements.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < placements.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{p.studentName}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{p.registerNumber}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{p.departmentName || '—'}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{p.jobRole}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 700, color: '#059669' }}>₹{p.packageAmount} LPA</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{p.joiningDate || 'TBD'}</td>
                  <td style={{ padding: '12px 14px', fontSize: '11px', color: '#94A3B8' }}>{p.placementDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
