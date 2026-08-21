import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import {
  Users,
  Building2,
  CheckCircle2,
  FileQuestion,
  Upload,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalDepartments: 0,
    activeStudents: 0,
    pendingCorrectionRequests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Failed to fetch real-time dashboard statistics from backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-white/90 mb-3 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5" /> Phase 1 Administration Panel
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Placement Overview</h1>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            Centralized placement management, student account onboarding, and data verification portal.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-all border border-white/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Stats
          </button>
          <Link
            to="/admin/bulk-import"
            className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-blue-700 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <Upload className="w-4 h-4" />
            Bulk Import Students
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs">
          {error}
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Students */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-card transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {loading ? '...' : stats.totalStudents}
          </div>
          <p className="text-xs text-slate-500 font-medium">Onboarded in OPMS</p>
        </div>

        {/* Card 2: Total Departments */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-card transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Departments</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {loading ? '...' : stats.totalDepartments}
          </div>
          <p className="text-xs text-slate-500 font-medium">Active Academic Branches</p>
        </div>

        {/* Card 3: Active Students */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-card transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Accounts</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {loading ? '...' : stats.activeStudents}
          </div>
          <p className="text-xs text-slate-500 font-medium">Verified Credentials</p>
        </div>

        {/* Card 4: Pending Correction Requests */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-card transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Requests</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <FileQuestion className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {loading ? '...' : stats.pendingCorrectionRequests}
          </div>
          <p className="text-xs text-slate-500 font-medium">Awaiting Master Review</p>
        </div>
      </div>

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/bulk-import"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:border-blue-300 hover:shadow-card transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Student Bulk Import</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload CSV or Excel (.xlsx) files to generate student accounts and send credentials automatically.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
            Import Students <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <Link
          to="/admin/departments"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:border-indigo-300 hover:shadow-card transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Department Management</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Configure department codes (CSE, ECE, EEE, MECH, CIVIL) and active status settings.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
            Manage Departments <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <Link
          to="/admin/correction-requests"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:border-purple-300 hover:shadow-card transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
              <FileQuestion className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Correction Requests</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review student master-data change requests and approve/reject with audit logging.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
            Review Requests ({stats.pendingCorrectionRequests}) <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
};
