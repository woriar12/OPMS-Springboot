import React, { useEffect, useState } from 'react';
import { Building2, ClipboardList, CheckCircle, XCircle, Briefcase, Clock, Users, FileText } from 'lucide-react';
import { officerService } from '../../services/officerService';

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

export const OfficerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    officerService.getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  const cards = [
    { icon: Building2, label: 'Total Companies', value: stats?.totalCompanies, color: '#2563EB', bg: '#EFF6FF' },
    { icon: ClipboardList, label: 'Pending Requests', value: stats?.pendingCompanyRequests, color: '#D97706', bg: '#FFFBEB' },
    { icon: CheckCircle, label: 'Approved Companies', value: stats?.approvedCompanies, color: '#059669', bg: '#ECFDF5' },
    { icon: XCircle, label: 'Rejected Companies', value: stats?.rejectedCompanies, color: '#DC2626', bg: '#FEF2F2' },
    { icon: Briefcase, label: 'Active Drives', value: stats?.activeDrives, color: '#7C3AED', bg: '#F5F3FF' },
    { icon: FileText, label: 'Pending Drive Approvals', value: stats?.pendingDriveApprovals, color: '#D97706', bg: '#FFFBEB' },
    { icon: Clock, label: 'Total Drives', value: stats?.totalDrives, color: '#0891B2', bg: '#ECFEFF' },
    { icon: Users, label: 'Total Students', value: stats?.totalStudents, color: '#059669', bg: '#ECFDF5' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1E293B' }}>Placement Officer Dashboard</h1>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>Overview of placement activities</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {cards.map((card, i) => <StatCard key={i} {...card} />)}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
