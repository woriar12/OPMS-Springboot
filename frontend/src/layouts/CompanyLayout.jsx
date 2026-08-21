import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, UserCircle, Briefcase, PlusCircle, LogOut,
  ChevronLeft, ChevronRight, Users, Calendar, Award, CheckCircle2
} from 'lucide-react';

const navItems = [
  { to: '/company/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/company/profile', icon: UserCircle, label: 'Company Profile' },
  { to: '/company/drives', icon: Briefcase, label: 'My Drives' },
  { to: '/company/drives/create', icon: PlusCircle, label: 'Create Drive' },
  { to: '/company/applications', icon: Users, label: 'Applications' },
  { to: '/company/interviews', icon: Calendar, label: 'Interviews' },
  { to: '/company/offers', icon: Award, label: 'Issued Offers' },
  { to: '/company/placements', icon: CheckCircle2, label: 'Placed Candidates' },
];

export const CompanyLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? '64px' : '220px', minHeight: '100vh',
        background: '#fff', borderRight: '1px solid #E2E8F0',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.2s ease', position: 'sticky', top: 0,
        boxShadow: '2px 0 8px rgba(0,0,0,0.04)', flexShrink: 0,
      }}>
        {/* Brand */}
        <div style={{ padding: '18px 14px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
            background: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: '13px',
          }}>CO</div>
          {!collapsed && <span style={{ fontWeight: 700, fontSize: '13px', color: '#1E293B', whiteSpace: 'nowrap' }}>
            Company Portal
          </span>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/company/drives'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 10px', borderRadius: '10px', textDecoration: 'none',
                fontSize: '13px', fontWeight: 500, transition: 'all 0.15s',
                color: isActive ? '#7C3AED' : '#64748B',
                background: isActive ? '#F5F3FF' : 'transparent',
                whiteSpace: 'nowrap', overflow: 'hidden',
              })}>
              <Icon size={16} style={{ flexShrink: 0 }} />
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '10px 8px', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 10px', borderRadius: '10px', cursor: 'pointer',
            fontSize: '13px', fontWeight: 500, color: '#EF4444',
            background: 'none', border: 'none', width: '100%',
            whiteSpace: 'nowrap', overflow: 'hidden',
          }}>
            <LogOut size={16} style={{ flexShrink: 0 }} />
            {!collapsed && 'Logout'}
          </button>
          <button onClick={() => setCollapsed(v => !v)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '8px', borderRadius: '10px', cursor: 'pointer',
            background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B',
          }}>
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{
          background: '#fff', borderBottom: '1px solid #E2E8F0',
          padding: '0 24px', height: '56px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
            Company Dashboard — OPMS
          </span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 12px', borderRadius: '100px',
            background: '#F5F3FF', border: '1px solid #DDD6FE',
          }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '10px', fontWeight: 700,
            }}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#6D28D9' }}>
              {user?.username}
            </span>
          </div>
        </header>
        <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
