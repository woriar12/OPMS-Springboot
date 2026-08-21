import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import { CompanyDriveEditModal } from './CompanyDriveEditModal';
import { PlusCircle, Eye, Briefcase, Send, Edit } from 'lucide-react';

const statusColors = {
  DRAFT: { color: '#64748B', bg: '#F1F5F9' },
  PENDING_APPROVAL: { color: '#D97706', bg: '#FFFBEB' },
  APPROVED: { color: '#059669', bg: '#ECFDF5' },
  ACTIVE: { color: '#2563EB', bg: '#EFF6FF' },
  CLOSED: { color: '#64748B', bg: '#F1F5F9' },
  REJECTED: { color: '#DC2626', bg: '#FEF2F2' },
};

const Badge = ({ status }) => {
  const s = statusColors[status] || statusColors.DRAFT;
  return <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, color: s.color, background: s.bg }}>{status?.replace('_', ' ')}</span>;
};

export const CompanyDriveList = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [editingDrive, setEditingDrive] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = () => {
    setLoading(true);
    companyService.getMyDrives().then(setDrives).catch(console.error).finally(() => setLoading(false));
  };

  const handleSubmitDrive = async (id) => {
    setSubmittingId(id);
    try {
      const updated = await companyService.submitDrive(id);
      setDrives(prev => prev.map(d => d.id === id ? updated : d));
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to submit drive for approval');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleEditClick = (drive) => {
    setEditingDrive(drive);
    setIsEditModalOpen(true);
  };

  const handleDriveUpdated = (updatedDrive) => {
    setDrives(prev => prev.map(d => d.id === updatedDrive.id ? updatedDrive : d));
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading drives...</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>My Placement Drives</h1>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>{drives.length} drives created</p>
        </div>
        <Link to="/company/drives/create" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '9px 16px', background: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
          color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '13px',
        }}>
          <PlusCircle size={15} /> Create Drive
        </Link>
      </div>

      {drives.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '48px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <Briefcase size={36} color="#CBD5E1" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 16px' }}>No placement drives created yet</p>
          <Link to="/company/drives/create" style={{ display: 'inline-block', padding: '9px 18px', background: '#7C3AED', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '13px' }}>
            Create Your First Drive
          </Link>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Title', 'Job Role', 'Location', 'Deadline', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drives.map((d, i) => (
                <tr key={d.id} style={{ borderBottom: i < drives.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{d.title}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#374151' }}>{d.jobRole}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151' }}>{d.location || '—'}</td>
                  <td style={{ padding: '12px 14px', fontSize: '11px', color: '#94A3B8' }}>{d.applicationDeadline || '—'}</td>
                  <td style={{ padding: '12px 14px' }}><Badge status={d.status} /></td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => navigate(`/company/drives/${d.id}`)}
                        style={{ padding: '5px 8px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', cursor: 'pointer', fontSize: '11px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Eye size={12} /> View
                      </button>
                      <button onClick={() => handleEditClick(d)}
                        style={{ padding: '5px 8px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#EFF6FF', cursor: 'pointer', fontSize: '11px', fontWeight: 600, color: '#2563EB', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Edit size={12} /> Edit
                      </button>
                      {d.status === 'DRAFT' && (
                        <button onClick={() => handleSubmitDrive(d.id)} disabled={submittingId === d.id}
                          style={{ padding: '5px 8px', borderRadius: '8px', border: 'none', background: '#7C3AED', cursor: 'pointer', fontSize: '11px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Send size={11} /> {submittingId === d.id ? 'Submitting...' : 'Submit'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Drive Modal */}
      <CompanyDriveEditModal
        drive={editingDrive}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onDriveUpdated={handleDriveUpdated}
      />
    </div>
  );
};
