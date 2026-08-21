import React, { useEffect, useState } from 'react';
import { Briefcase, FileText, CheckCircle, Clock, XCircle, Users, PlusCircle } from 'lucide-react';
import { companyService } from '../../services/companyService';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div style={{
    background: '#fff', borderRadius: '14px', padding: '20px',
    border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px',
      background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Icon size={22} color={color} />
    </div>
    <div>
      <p style={{ margin: 0, fontSize: '12px', color: '#64748B', fontWeight: 500 }}>{label}</p>
      <p style={{ margin: '2px 0 0', fontSize: '24px', fontWeight: 700, color: '#1E293B' }}>{value ?? '—'}</p>
    </div>
  </div>
);

export const CompanyDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyService.getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading...</div>;

  const cards = [
    { icon: Briefcase, label: 'Total Drives', value: stats?.totalDrives, color: '#7C3AED', bg: '#F5F3FF' },
    { icon: Clock, label: 'Draft Drives', value: stats?.draftDrives, color: '#64748B', bg: '#F1F5F9' },
    { icon: FileText, label: 'Pending Approval', value: stats?.pendingDrives, color: '#D97706', bg: '#FFFBEB' },
    { icon: CheckCircle, label: 'Approved Drives', value: stats?.approvedDrives, color: '#059669', bg: '#ECFDF5' },
    { icon: Briefcase, label: 'Active Drives', value: stats?.activeDrives, color: '#2563EB', bg: '#EFF6FF' },
    { icon: XCircle, label: 'Rejected Drives', value: stats?.rejectedDrives, color: '#DC2626', bg: '#FEF2F2' },
    { icon: Users, label: 'Total Applications', value: stats?.totalApplications ?? 0, color: '#0891B2', bg: '#ECFEFF' },
    { icon: CheckCircle, label: 'Selected Students', value: stats?.selected ?? 0, color: '#059669', bg: '#ECFDF5' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1E293B' }}>Company Dashboard</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>Manage placement drives and view candidate statistics</p>
        </div>
        <Link to="/company/drives/create" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '10px 18px', background: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
          color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '13px',
        }}>
          <PlusCircle size={16} /> Create Drive
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {cards.map((card, i) => <StatCard key={i} {...card} />)}
      </div>
    </div>
  );
};
