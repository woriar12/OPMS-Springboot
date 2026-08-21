import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { companyService } from '../services/companyService';
import { Building2, CheckCircle2, AlertCircle } from 'lucide-react';

export const CompanyRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    website: '',
    logoUrl: '',
    description: '',
    hrEmail: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    hrContactPerson: '',
    designation: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await companyService.registerCompany(formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '36px', maxWidth: '460px', width: '100%', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <CheckCircle2 size={48} color="#059669" style={{ marginBottom: '16px' }} />
          <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>Registration Submitted!</h2>
          <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#64748B', lineHeight: '1.5' }}>
            Thank you for registering <strong>{formData.companyName}</strong>. Your account is currently <strong>PENDING</strong> verification by the Placement Officer.
          </p>
          <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#475569', background: '#F1F5F9', padding: '12px', borderRadius: '10px' }}>
            Once approved, login credentials will be emailed to <strong>{formData.hrEmail}</strong>.
          </p>
          <Link to="/login" style={{ display: 'inline-block', width: '100%', padding: '10px', background: '#2563EB', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '14px', boxSizing: 'border-box' }}>
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '40px 20px', fontFamily: "'Inter', sans-serif", display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '680px', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '12px' }}>
            <Building2 size={24} />
          </div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>Company Registration</h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748B' }}>Register your organization with OPMS for campus placements</p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#DC2626', fontSize: '13px' }}>
            <AlertCircle size={16} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          {/* Section 1 */}
          <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Company Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Company Name *</label>
              <input name="companyName" required value={formData.companyName} onChange={handleChange} placeholder="e.g. Acme Corp"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Industry *</label>
              <input name="industry" required value={formData.industry} onChange={handleChange} placeholder="e.g. Information Technology"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Website URL</label>
              <input name="website" value={formData.website} onChange={handleChange} placeholder="https://acme.com"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Logo URL</label>
              <input name="logoUrl" value={formData.logoUrl} onChange={handleChange} placeholder="https://..."
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Company Description</label>
              <textarea name="description" rows={3} value={formData.description} onChange={handleChange} placeholder="Brief overview of your company..."
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '24px 0' }} />

          {/* Section 2 */}
          <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>HR Contact Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>HR Email *</label>
              <input name="hrEmail" type="email" required value={formData.hrEmail} onChange={handleChange} placeholder="hr@acme.com"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Phone Number *</label>
              <input name="phone" required value={formData.phone} onChange={handleChange} placeholder="+91 9876543210"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Contact Person</label>
              <input name="hrContactPerson" value={formData.hrContactPerson} onChange={handleChange} placeholder="Jane Doe"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Designation</label>
              <input name="designation" value={formData.designation} onChange={handleChange} placeholder="Lead HR Manager"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '24px 0' }} />

          {/* Section 3 */}
          <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Location</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Address</label>
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Street Address"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>City</label>
              <input name="city" value={formData.city} onChange={handleChange} placeholder="City"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>State</label>
              <input name="state" value={formData.state} onChange={handleChange} placeholder="State"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Country</label>
              <input name="country" value={formData.country} onChange={handleChange} placeholder="Country"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Link to="/login" style={{ textDecoration: 'none', color: '#64748B', fontSize: '13px', fontWeight: 500 }}>Already registered? Login</Link>
            <button type="submit" disabled={loading}
              style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
