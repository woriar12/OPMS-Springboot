import React, { useEffect, useState } from 'react';
import { officerService } from '../../services/officerService';
import { FileText, Search } from 'lucide-react';

const statusColors = {
  APPLIED: { color: '#2563EB', bg: '#EFF6FF' },
  SHORTLISTED: { color: '#7C3AED', bg: '#F5F3FF' },
  INTERVIEW_SCHEDULED: { color: '#0891B2', bg: '#ECFEFF' },
  SELECTED: { color: '#059669', bg: '#ECFDF5' },
  OFFERED: { color: '#059669', bg: '#ECFDF5' },
  PLACED: { color: '#059669', bg: '#ECFDF5' },
  REJECTED: { color: '#DC2626', bg: '#FEF2F2' },
};

const Badge = ({ status }) => {
  const s = statusColors[status] || statusColors.APPLIED;
  return <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, color: s.color, background: s.bg }}>{status?.replace('_', ' ')}</span>;
};

export const OfficerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    officerService.getAllApplications().then(setApplications).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = applications.filter(a => {
    const matchSearch = a.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      a.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      a.registerNumber?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || a.status === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading all applications...</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>All Student Applications</h1>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>College-wide placement application monitoring</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'APPLIED', 'SHORTLISTED', 'SELECTED', 'PLACED', 'REJECTED'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 10px', borderRadius: '8px', border: '1px solid #E2E8F0',
              background: filter === f ? '#2563EB' : '#fff', color: filter === f ? '#fff' : '#374151',
              fontSize: '11px', fontWeight: 500, cursor: 'pointer',
            }}>{f}</button>
          ))}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '6px', paddingBottom: '6px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '12px', outline: 'none', minWidth: '160px' }} />
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {['Student', 'Dept', 'CGPA', 'Company', 'Drive Role', 'Applied Date', 'Status'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={a.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                <td style={{ padding: '12px 14px' }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: '#1E293B' }}>{a.studentName}</p>
                  <p style={{ margin: '1px 0 0', fontSize: '11px', color: '#94A3B8' }}>{a.registerNumber}</p>
                </td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{a.departmentCode || '—'}</td>
                <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: '#374151' }}>{a.cgpa ?? '0.0'}</td>
                <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{a.companyName}</td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{a.jobRole}</td>
                <td style={{ padding: '12px 14px', fontSize: '11px', color: '#94A3B8' }}>
                  {a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : '—'}
                </td>
                <td style={{ padding: '12px 14px' }}><Badge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
