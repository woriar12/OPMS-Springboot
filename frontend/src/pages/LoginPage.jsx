import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight, GraduationCap, Building2, Briefcase } from 'lucide-react';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in both username and password.');
      return;
    }

    try {
      setError('');
      setSubmitting(true);
      const res = await login(username, password);

      if (res.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (res.role === 'PLACEMENT_OFFICER') {
        navigate('/officer/dashboard');
      } else if (res.role === 'COMPANY') {
        if (res.firstLogin) {
          navigate('/company/profile');
        } else {
          navigate('/company/dashboard');
        }
      } else if (res.role === 'STUDENT') {
        if (res.firstLogin) {
          navigate('/student/change-password');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        setError('Unauthorized role');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Invalid username or password.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAdmin = () => {
    setUsername('admin');
    setPassword('Admin@12345');
    setError('');
  };

  const fillDemoOfficer = () => {
    setUsername('officer1');
    setPassword('Officer@12345');
    setError('');
  };

  const fillDemoStudent = () => {
    setUsername('24CS001');
    setPassword('OPMS@a1b2');
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F0F4FF 0%, #EEF2FF 40%, #F5F3FF 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      {/* Decorative background circles */}
      <div style={{
        position: 'fixed', top: '-80px', right: '-80px',
        width: '320px', height: '320px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-80px', left: '-80px',
        width: '360px', height: '360px',
        background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '420px', width: '100%', position: 'relative' }}>

        {/* Header branding */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '56px', height: '56px', borderRadius: '18px',
            background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
            color: '#fff', marginBottom: '12px',
            boxShadow: '0 8px 24px rgba(79,70,229,0.30)',
          }}>
            <GraduationCap size={28} />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1E293B', margin: 0, letterSpacing: '-0.5px' }}>
            Online Placement Management
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Single Sign-On Portal &mdash; OPMS System
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 50px -10px rgba(79,70,229,0.12)',
          border: '1px solid rgba(226,232,240,0.8)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
            Welcome back 👋
          </h2>
          <p style={{ fontSize: '12.5px', color: '#94A3B8', marginBottom: '20px' }}>
            Sign in with your registered credentials to continue
          </p>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: '20px', padding: '12px 16px',
              background: '#FEF2F2', border: '1px solid #FECACA',
              borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start',
            }}>
              <AlertCircle size={16} color="#EF4444" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#B91C1C', margin: '0 0 2px 0' }}>
                  Authentication Failed
                </p>
                <p style={{ fontSize: '12px', color: '#DC2626', margin: 0 }}>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Username */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Username or Register Number
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin, officer1, or 24CS001"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    paddingLeft: '40px', paddingRight: '14px',
                    paddingTop: '11px', paddingBottom: '11px',
                    background: '#F8FAFC', border: '1.5px solid #E2E8F0',
                    borderRadius: '12px', fontSize: '13.5px',
                    color: '#1E293B', outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#2563EB';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.10)';
                    e.target.style.background = '#fff';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#F8FAFC';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    paddingLeft: '40px', paddingRight: '40px',
                    paddingTop: '11px', paddingBottom: '11px',
                    background: '#F8FAFC', border: '1.5px solid #E2E8F0',
                    borderRadius: '12px', fontSize: '13.5px',
                    color: '#1E293B', outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#2563EB';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.10)';
                    e.target.style.background = '#fff';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#F8FAFC';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: '#9CA3AF',
                    fontSize: '11px', fontWeight: 600, padding: '2px 4px',
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%', marginTop: '4px',
                padding: '12px 16px',
                background: submitting
                  ? '#93C5FD'
                  : 'linear-gradient(135deg, #2563EB, #4F46E5)',
                color: '#fff', border: 'none', borderRadius: '12px',
                fontSize: '14px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: submitting ? 'none' : '0 4px 15px rgba(79,70,229,0.30)',
                transition: 'all 0.2s',
                letterSpacing: '0.01em',
              }}
            >
              {submitting ? (
                <>
                  <div style={{
                    width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)',
                    borderTop: '2px solid #fff', borderRadius: '50%',
                    animation: 'opms-spin 0.8s linear infinite',
                  }} />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Portal
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Company Registration CTA */}
          <div style={{ marginTop: '16px', textAlign: 'center', padding: '10px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Are you a hiring company? </span>
            <Link to="/company/register" style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', textDecoration: 'none' }}>
              Register Company &rarr;
            </Link>
          </div>

          {/* Quick Demo Credentials */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#CBD5E1', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Quick Demo Credentials
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              <button
                type="button"
                onClick={fillDemoAdmin}
                style={{
                  padding: '7px 8px', background: '#F0F9FF',
                  border: '1px solid #BFDBFE', borderRadius: '8px',
                  fontSize: '11px', fontWeight: 600, color: '#1D4ED8',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '4px',
                }}
              >
                <ShieldCheck size={12} color="#2563EB" /> Admin
              </button>
              <button
                type="button"
                onClick={fillDemoOfficer}
                style={{
                  padding: '7px 8px', background: '#EFF6FF',
                  border: '1px solid #93C5FD', borderRadius: '8px',
                  fontSize: '11px', fontWeight: 600, color: '#1E40AF',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '4px',
                }}
              >
                <Briefcase size={12} color="#1E40AF" /> Officer
              </button>
              <button
                type="button"
                onClick={fillDemoStudent}
                style={{
                  padding: '7px 8px', background: '#F5F3FF',
                  border: '1px solid #DDD6FE', borderRadius: '8px',
                  fontSize: '11px', fontWeight: 600, color: '#6D28D9',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '4px',
                }}
              >
                <User size={12} color="#7C3AED" /> Student
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: '11.5px', color: '#94A3B8', marginTop: '16px' }}>
          &copy; 2026 Online Placement Management System (OPMS)
        </p>
      </div>

      <style>{`
        @keyframes opms-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
