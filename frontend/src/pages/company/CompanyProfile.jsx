import React, { useEffect, useState } from 'react';
import { companyService } from '../../services/companyService';
import { Building2, Save, AlertCircle, CheckCircle } from 'lucide-react';

export const CompanyProfile = () => {
  const [profile, setProfile] = useState({
    companyName: '', industry: '', website: '', logoUrl: '', description: '',
    hrEmail: '', phone: '', address: '', city: '', state: '', country: '',
    hrContactPerson: '', designation: '', status: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    companyService.getMyProfile()
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const updated = await companyService.updateMyProfile(profile);
      setProfile(updated);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading profile...</div>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1E293B' }}>Company Profile</h1>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>View and manage company information</p>
      </div>

      {message.text && (
        <div style={{
          padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px',
          display: 'flex', alignItems: 'center', gap: '10px',
          background: message.type === 'success' ? '#ECFDF5' : '#FEF2F2',
          color: message.type === 'success' ? '#059669' : '#DC2626',
          border: `1px solid ${message.type === 'success' ? '#A7F3D0' : '#FECACA'}`,
        }}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '28px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>Company Info</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Company Name</label>
            <input value={profile.companyName || ''} disabled style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', background: '#F8FAFC', color: '#64748B', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Industry</label>
            <input value={profile.industry || ''} disabled style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', background: '#F8FAFC', color: '#64748B', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Website</label>
            <input name="website" value={profile.website || ''} onChange={handleChange} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Logo URL</label>
            <input name="logoUrl" value={profile.logoUrl || ''} onChange={handleChange} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Description</label>
            <textarea name="description" rows={3} value={profile.description || ''} onChange={handleChange} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '20px 0' }} />

        <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>HR Contact Info</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>HR Email</label>
            <input value={profile.hrEmail || ''} disabled style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', background: '#F8FAFC', color: '#64748B', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Phone</label>
            <input name="phone" value={profile.phone || ''} onChange={handleChange} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Contact Person</label>
            <input name="hrContactPerson" value={profile.hrContactPerson || ''} onChange={handleChange} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Designation</label>
            <input name="designation" value={profile.designation || ''} onChange={handleChange} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button type="submit" disabled={saving} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={15} /> {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
