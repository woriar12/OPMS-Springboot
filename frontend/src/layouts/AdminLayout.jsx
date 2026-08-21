import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Upload,
  Building2,
  FileSpreadsheet,
  FileText,
  LogOut,
  Shield,
  Bell
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Students', path: '/admin/students', icon: Users },
    { label: 'Bulk Import', path: '/admin/bulk-import', icon: Upload },
    { label: 'Departments', path: '/admin/departments', icon: Building2 },
    { label: 'Placement Officers', path: '/admin/officers', icon: Users },
    { label: 'Correction Requests', path: '/admin/correction-requests', icon: FileText },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-sm fixed inset-y-0 z-20">
        <div>
          {/* Logo Header */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              OP
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">OPMS Admin</h1>
              <p className="text-[11px] font-medium text-slate-400">Placement SaaS</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / User Info */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs shrink-0">
                AD
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.username || 'Administrator'}</p>
                <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700 rounded-full">
                  ADMIN
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        {/* Top Sticky Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Portal</span>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-sm font-semibold text-slate-800">
              {navItems.find((n) => n.path === location.pathname)?.label || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Phase 1 Active
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
