import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Building2, ClipboardList, Briefcase, FileCheck,
  MapPin, Users, LogOut, Bell, ChevronLeft, ChevronRight, UserCircle,
  FileText, Calendar, Award, CheckCircle2, BarChart2
} from 'lucide-react';

const navItems = [
  { to: '/officer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/officer/company-requests', icon: ClipboardList, label: 'Company Requests' },
  { to: '/officer/companies', icon: Building2, label: 'All Companies' },
  { to: '/officer/drive-requests', icon: FileCheck, label: 'Drive Requests' },
  { to: '/officer/drives', icon: Briefcase, label: 'All Drives' },
  { to: '/officer/department-mapping', icon: MapPin, label: 'Dept. Mapping' },
  { to: '/officer/applications', icon: FileText, label: 'All Applications' },
  { to: '/officer/interviews', icon: Calendar, label: 'Interviews' },
  { to: '/officer/offers', icon: Award, label: 'Issued Offers' },
  { to: '/officer/placements', icon: CheckCircle2, label: 'Placements' },
  { to: '/officer/reports', icon: BarChart2, label: 'Reports & Analytics' },
  { to: '/officer/profile', icon: UserCircle, label: 'My Profile' },
];

export const OfficerLayout = () => {
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
            background: 'linear-gradient(135deg,#2563EB,#4F46E5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: '13px',
          }}>OP</div>
          {!collapsed && <span style={{ fontWeight: 700, fontSize: '13px', color: '#1E293B', whiteSpace: 'nowrap' }}>
            Placement Officer
          </span>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px', borderRadius: '10px', textDecoration: 'none',
                fontSize: '12.5px', fontWeight: 500, transition: 'all 0.15s',
                color: isActive ? '#2563EB' : '#64748B',
                background: isActive ? '#EFF6FF' : 'transparent',
                whiteSpace: 'nowrap', overflow: 'hidden',
              })}>
              <Icon size={15} style={{ flexShrink: 0 }} />
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>

        {/* Logout & Collapse */}
        <div style={{ padding: '10px 8px', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 10px', borderRadius: '10px', cursor: 'pointer',
            fontSize: '12.5px', fontWeight: 500, color: '#EF4444',
            background: 'none', border: 'none', width: '100%',
            whiteSpace: 'nowrap', overflow: 'hidden',
          }}>
            <LogOut size={15} style={{ flexShrink: 0 }} />
            {!collapsed && 'Logout'}
          </button>
          <button onClick={() => setCollapsed(v => !v)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '6px', borderRadius: '10px', cursor: 'pointer',
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
            Placement Officer Portal
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 12px', borderRadius: '100px',
              background: '#F0F9FF', border: '1px solid #BFDBFE',
            }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#2563EB,#4F46E5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '10px', fontWeight: 700,
              }}>
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#1D4ED8' }}>
                {user?.username}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
