import React, { useEffect, useState } from 'react';
import { Briefcase, Send, CheckCircle, Calendar, Award, FileText, CheckCircle2 } from 'lucide-react';
import { studentService } from '../services/studentService';
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
      <p style={{ margin: '2px 0 0', fontSize: '24px', fontWeight: 700, color: '#1E293B' }}>{value ?? '0'}</p>
    </div>
  </div>
);

export const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading dashboard...</div>;

  const cards = [
    { icon: Briefcase, label: 'Eligible Drives', value: stats?.eligibleDrives, color: '#2563EB', bg: '#EFF6FF' },
    { icon: Send, label: 'Applied Drives', value: stats?.appliedDrives, color: '#7C3AED', bg: '#F5F3FF' },
    { icon: CheckCircle, label: 'Shortlisted', value: stats?.shortlisted, color: '#D97706', bg: '#FFFBEB' },
    { icon: Calendar, label: 'Interviews Scheduled', value: stats?.interviews, color: '#0891B2', bg: '#ECFEFF' },
    { icon: Award, label: 'Job Offers', value: stats?.offers, color: '#059669', bg: '#ECFDF5' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1E293B' }}>Student Dashboard</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>Track your eligible placement drives, applications, and offers</p>
        </div>
        <Link to="/student/drives" style={{
          padding: '10px 18px', background: 'linear-gradient(135deg,#2563EB,#4F46E5)',
          color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '13px',
        }}>
          Explore Drives
        </Link>
      </div>

      {/* Placement Status Alert if Placed */}
      {stats?.isPlaced && (
        <div style={{
          background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '14px',
          padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px'
        }}>
          <CheckCircle2 size={36} color="#059669" style={{ flexShrink: 0 }} />
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#065F46' }}>
              🎉 Congratulations! You are PLACED!
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#047857' }}>
              Offer accepted at <strong>{stats.placedCompany}</strong> with package <strong>₹{stats.placedPackage} LPA</strong>.
            </p>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {cards.map((card, i) => <StatCard key={i} {...card} />)}
      </div>
    </div>
  );
};
