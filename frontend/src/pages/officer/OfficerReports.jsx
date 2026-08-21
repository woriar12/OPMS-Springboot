import React, { useEffect, useState } from 'react';
import { officerService } from '../../services/officerService';
import { Download, PieChart, BarChart2, Users, Building2, Briefcase, Award } from 'lucide-react';

export const OfficerReports = () => {
  const [overall, setOverall] = useState(null);
  const [deptReports, setDeptReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      officerService.getOverallReport(),
      officerService.getDepartmentReports()
    ]).then(([ov, depts]) => {
      setOverall(ov);
      setDeptReports(depts);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleExportCsv = async () => {
    try {
      const res = await officerService.exportPlacementCsv();
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'opms_placement_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert('Failed to export CSV');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading placement analytics & reports...</div>;

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1E293B' }}>Placement Reports & Analytics</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>Department-wise & overall placement statistics</p>
        </div>
        <button onClick={handleExportCsv} style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '10px 18px', background: '#2563EB', color: '#fff',
          borderRadius: '10px', border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer'
        }}>
          <Download size={16} /> Download Full CSV Report
        </button>
      </div>

      {/* Overall Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Overall Placement Rate</p>
          <p style={{ margin: '4px 0 0', fontSize: '26px', fontWeight: 800, color: '#059669' }}>{overall?.placementPercentage ?? 0}%</p>
        </div>
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Total Students Placed</p>
          <p style={{ margin: '4px 0 0', fontSize: '26px', fontWeight: 800, color: '#2563EB' }}>{overall?.placedStudents ?? 0}</p>
        </div>
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Unplaced Students</p>
          <p style={{ margin: '4px 0 0', fontSize: '26px', fontWeight: 800, color: '#DC2626' }}>{overall?.totalUnplaced ?? 0}</p>
        </div>
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Total Applications</p>
          <p style={{ margin: '4px 0 0', fontSize: '26px', fontWeight: 800, color: '#7C3AED' }}>{overall?.totalApplications ?? 0}</p>
        </div>
      </div>

      {/* Department-wise Placement Analytics Table */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>Department-wise Placement Performance</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fff' }}>
              {['Department Code', 'Department Name', 'Total Students', 'Placed Students', 'Placement %'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deptReports.map((d, i) => (
              <tr key={d.departmentId} style={{ borderBottom: i < deptReports.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 700, color: '#2563EB' }}>{d.departmentCode}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#1E293B', fontWeight: 600 }}>{d.departmentName}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>{d.totalStudents}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 700, color: '#059669' }}>{d.placedStudents}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1, height: '8px', background: '#E2E8F0', borderRadius: '100px', overflow: 'hidden', maxWidth: '120px' }}>
                      <div style={{ width: `${Math.min(100, d.placementPercentage)}%`, height: '100%', background: 'linear-gradient(90deg,#2563EB,#059669)', borderRadius: '100px' }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>{d.placementPercentage}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
