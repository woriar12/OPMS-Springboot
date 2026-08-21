import React, { useEffect, useState } from 'react';
import { officerService } from '../../services/officerService';
import { CheckCircle2, Download } from 'lucide-react';

export const OfficerPlacements = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    officerService.getAllPlacements().then(setPlacements).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleExportCsv = async () => {
    try {
      const res = await officerService.exportPlacementCsv();
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'opms_placements_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert('Failed to export CSV');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading placements...</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>Official Placement Records</h1>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>{placements.length} total students placed</p>
        </div>
        <button onClick={handleExportCsv} style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '9px 16px', background: '#059669', color: '#fff',
          borderRadius: '10px', border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer'
        }}>
          <Download size={15} /> Export CSV Report
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {['Student Name', 'Register No', 'Department', 'Company', 'Job Role', 'Package', 'Placement Date'].map(h => (
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
                <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{p.companyName}</td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{p.jobRole}</td>
                <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 700, color: '#059669' }}>₹{p.packageAmount} LPA</td>
                <td style={{ padding: '12px 14px', fontSize: '11px', color: '#94A3B8' }}>{p.placementDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
