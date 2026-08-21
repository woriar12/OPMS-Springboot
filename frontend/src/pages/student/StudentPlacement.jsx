import React, { useEffect, useState } from 'react';
import { studentService } from '../../services/studentService';
import { Award, CheckCircle2, Building2, MapPin, Calendar, FileText } from 'lucide-react';

export const StudentPlacement = () => {
  const [placement, setPlacement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.getMyPlacement()
      .then(setPlacement)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading placement record...</div>;

  return (
    <div style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>My Placement Status</h1>
        <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>Official college placement record</p>
      </div>

      {!placement ? (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '48px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <Award size={36} color="#CBD5E1" style={{ marginBottom: '12px' }} />
          <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 700, color: '#1E293B' }}>Status: Not Placed Yet</h3>
          <p style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>Keep applying to active drives to secure your placement offer.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={32} color="#059669" />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '100px' }}>OFFICIALLY PLACED</span>
              <h2 style={{ margin: '4px 0 2px', fontSize: '20px', fontWeight: 800, color: '#1E293B' }}>{placement.companyName}</h2>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748B', fontWeight: 600 }}>{placement.jobRole}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px' }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Package CTC</p>
              <p style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 800, color: '#059669' }}>₹{placement.packageAmount} LPA</p>
            </div>
            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px' }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Joining Date</p>
              <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>{placement.joiningDate || 'TBD'}</p>
            </div>
            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px' }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Drive Title</p>
              <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{placement.driveTitle}</p>
            </div>
            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px' }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Placement Date</p>
              <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{placement.placementDate}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
