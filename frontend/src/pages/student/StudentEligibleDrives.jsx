import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { Briefcase, Eye, Calendar, MapPin, CheckCircle2, Search } from 'lucide-react';

export const StudentEligibleDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    studentService.getEligibleDrives()
      .then(setDrives)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = drives.filter(d =>
    d.title?.toLowerCase().includes(search.toLowerCase()) ||
    d.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    d.jobRole?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading eligible drives...</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>Eligible Placement Drives</h1>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>Drives matching your academic department, CGPA, and backlog criteria</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drives..."
            style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '13px', outline: 'none', minWidth: '200px' }} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '48px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <Briefcase size={36} color="#CBD5E1" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>No eligible active drives available at this time</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filtered.map(d => (
            <div key={d.id} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#2563EB', background: '#EFF6FF', padding: '2px 8px', borderRadius: '100px' }}>
                      {d.jobType || 'Full Time'}
                    </span>
                    <h3 style={{ margin: '6px 0 2px', fontSize: '16px', fontWeight: 700, color: '#1E293B' }}>{d.title}</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B', fontWeight: 600 }}>{d.companyName}</p>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px', margin: '14px 0' }}>
                  <div><strong>Role:</strong> {d.jobRole}</div>
                  <div><strong>Package:</strong> {d.salaryDescription || (d.salaryMin ? `₹${d.salaryMin}L – ₹${d.salaryMax}L` : 'Disclosed during process')}</div>
                  <div><strong>Min CGPA:</strong> {d.minimumCgpa ?? '0.0'} | <strong>Max Backlogs:</strong> {d.maximumBacklogs ?? '0'}</div>
                  {d.location && <div><strong>Location:</strong> {d.location}</div>}
                  {d.applicationDeadline && <div style={{ color: '#DC2626', fontWeight: 500 }}><strong>Deadline:</strong> {d.applicationDeadline}</div>}
                </div>
              </div>

              <button onClick={() => navigate(`/student/drives/${d.id}`)}
                style={{ width: '100%', padding: '9px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#2563EB,#4F46E5)', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Eye size={14} /> View Details & Apply
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
