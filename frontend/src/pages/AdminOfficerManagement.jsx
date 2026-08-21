import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import { UserCheck, UserX, Plus, UserPlus, Search, AlertCircle } from 'lucide-react';

export const AdminOfficerManagement = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    employeeId: '',
    email: '',
    phone: '',
    department: 'Placement Cell',
  });

  useEffect(() => {
    loadOfficers();
  }, []);

  const loadOfficers = () => {
    adminService.getOfficers()
      .then(setOfficers)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleToggleStatus = async (officer) => {
    const newStatus = officer.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await adminService.updateOfficerStatus(officer.id, newStatus);
      loadOfficers();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update status');
    }
  };

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await adminService.createOfficer(formData);
      setModalOpen(false);
      setFormData({ username: '', fullName: '', employeeId: '', email: '', phone: '', department: 'Placement Cell' });
      loadOfficers();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to create Placement Officer');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = officers.filter(o =>
    o.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    o.username?.toLowerCase().includes(search.toLowerCase()) ||
    o.employeeId?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading officers...</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>Placement Officer Management</h1>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>Create and manage Placement Officer accounts</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search officers..."
              style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '13px', outline: 'none' }} />
          </div>
          <button onClick={() => setModalOpen(true)}
            style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#2563EB', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <UserPlus size={15} /> Add Officer
          </button>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {['Name & Username', 'Employee ID', 'Email', 'Phone', 'Department', 'Status', 'Action'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, i) => (
              <tr key={o.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                <td style={{ padding: '12px 14px' }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: '#1E293B' }}>{o.fullName}</p>
                  <p style={{ margin: '1px 0 0', fontSize: '11px', color: '#94A3B8' }}>@{o.username}</p>
                </td>
                <td style={{ padding: '12px 14px', fontSize: '13px', color: '#374151' }}>{o.employeeId || '—'}</td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{o.email || '—'}</td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{o.phone || '—'}</td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{o.department || 'Placement Cell'}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
                    color: o.status === 'ACTIVE' ? '#059669' : '#DC2626',
                    background: o.status === 'ACTIVE' ? '#ECFDF5' : '#FEF2F2',
                  }}>{o.status}</span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <button onClick={() => handleToggleStatus(o)}
                    style={{
                      padding: '5px 10px', borderRadius: '8px', border: '1px solid #E2E8F0',
                      background: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                      color: o.status === 'ACTIVE' ? '#DC2626' : '#059669',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                    {o.status === 'ACTIVE' ? <UserX size={12} /> : <UserCheck size={12} />}
                    {o.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleCreateOfficer} style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Add Placement Officer</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Username *</label>
                <input required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="e.g. officer2"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Full Name *</label>
                <input required value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} placeholder="e.g. Dr. A. Kumar"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Employee ID *</label>
                <input required value={formData.employeeId} onChange={e => setFormData({ ...formData, employeeId: e.target.value })} placeholder="e.g. PO002"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="officer@college.edu"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Phone</label>
                <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 9876543210"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
              <button type="submit" disabled={actionLoading} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#2563EB', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                {actionLoading ? 'Creating...' : 'Create Officer'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
