import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { officerService } from '../../services/officerService';
import { Eye, Building2, Search } from 'lucide-react';

const statusColors = {
  PENDING: { color: '#D97706', bg: '#FFFBEB' },
  APPROVED: { color: '#059669', bg: '#ECFDF5' },
  REJECTED: { color: '#DC2626', bg: '#FEF2F2' },
  SUSPENDED: { color: '#7C3AED', bg: '#F5F3FF' },
};

const Badge = ({ status }) => {
  const s = statusColors[status] || statusColors.PENDING;
  return (
    <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, color: s.color, background: s.bg }}>
      {status}
    </span>
  );
};

export const OfficerCompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    officerService.getAllCompanies().then(setCompanies).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = companies.filter(c => {
    const matchSearch = c.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      c.industry?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || c.status === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>All Companies</h1>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>{companies.length} total companies registered</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0',
              background: filter === f ? '#2563EB' : '#fff', color: filter === f ? '#fff' : '#374151',
              fontSize: '12px', fontWeight: 500, cursor: 'pointer',
            }}>{f}</button>
          ))}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '6px', paddingBottom: '6px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '12px', outline: 'none', minWidth: '160px' }} />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '48px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <Building2 size={36} color="#CBD5E1" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>No companies found</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Company', 'Industry', 'HR Email', 'Status', 'Registered', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, fontSize: '13px', color: '#1E293B' }}>{c.companyName}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#374151' }}>{c.industry}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{c.hrEmail}</td>
                  <td style={{ padding: '12px 14px' }}><Badge status={c.status} /></td>
                  <td style={{ padding: '12px 14px', fontSize: '11px', color: '#94A3B8' }}>
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <button onClick={() => navigate(`/officer/companies/${c.id}`)}
                      style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', cursor: 'pointer', fontSize: '11px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={12} /> View
                    </button>
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
