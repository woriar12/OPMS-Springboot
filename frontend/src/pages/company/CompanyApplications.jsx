import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import { Eye, CheckCircle, XCircle, Users, Search, Calendar, FileText } from 'lucide-react';

const statusColors = {
  APPLIED: { color: '#2563EB', bg: '#EFF6FF' },
  SHORTLISTED: { color: '#7C3AED', bg: '#F5F3FF' },
  INTERVIEW_SCHEDULED: { color: '#0891B2', bg: '#ECFEFF' },
  SELECTED: { color: '#059669', bg: '#ECFDF5' },
  REJECTED: { color: '#DC2626', bg: '#FEF2F2' },
  OFFERED: { color: '#059669', bg: '#ECFDF5' },
  PLACED: { color: '#059669', bg: '#ECFDF5' },
};

const Badge = ({ status }) => {
  const s = statusColors[status] || statusColors.APPLIED;
  return <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, color: s.color, background: s.bg }}>{status?.replace('_', ' ')}</span>;
};

export const CompanyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    companyService.getCompanyApplications()
      .then(setApplications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = applications.filter(a => {
    const matchSearch = a.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      a.registerNumber?.toLowerCase().includes(search.toLowerCase()) ||
      a.driveTitle?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading applications...</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>Candidate Applications</h1>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>Review student applications for your drives</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED'].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)} style={{
              padding: '6px 10px', borderRadius: '8px', border: '1px solid #E2E8F0',
              background: statusFilter === f ? '#7C3AED' : '#fff', color: statusFilter === f ? '#fff' : '#374151',
              fontSize: '11px', fontWeight: 500, cursor: 'pointer',
            }}>{f.replace('_', ' ')}</button>
          ))}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search candidate..."
              style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '6px', paddingBottom: '6px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '12px', outline: 'none', minWidth: '160px' }} />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '48px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <Users size={36} color="#CBD5E1" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>No candidate applications found</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Candidate Name', 'Register No', 'Dept', 'CGPA', 'Drive Role', 'Applied Date', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{a.studentName}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{a.registerNumber}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{a.departmentCode || '—'}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151', fontWeight: 600 }}>{a.cgpa ?? '0.0'}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{a.jobRole} ({a.driveTitle})</td>
                  <td style={{ padding: '12px 14px', fontSize: '11px', color: '#94A3B8' }}>
                    {a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '12px 14px' }}><Badge status={a.status} /></td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {a.resumeSnapshotUrl && (
                        <a href={a.resumeSnapshotUrl} target="_blank" rel="noreferrer"
                          style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid #93C5FD', background: '#EFF6FF', color: '#2563EB', textDecoration: 'none', fontSize: '11px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <FileText size={12} /> Resume
                        </a>
                      )}
                      <button onClick={() => navigate(`/company/applications/${a.id}`)}
                        style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', cursor: 'pointer', fontSize: '11px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={12} /> Review
                      </button>
                    </div>
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
