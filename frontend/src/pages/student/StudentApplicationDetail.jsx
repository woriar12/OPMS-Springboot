import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { ArrowLeft, Clock, CheckCircle2, Building2, UserCheck, Shield } from 'lucide-react';

export const StudentApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      studentService.getApplicationById(id),
      studentService.getApplicationHistory(id)
    ]).then(([appData, historyData]) => {
      setApp(appData);
      setHistory(historyData);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading timeline...</div>;
  if (!app) return <div style={{ textAlign: 'center', padding: '60px', color: '#EF4444' }}>Application not found</div>;

  return (
    <div style={{ maxWidth: '760px' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
        <ArrowLeft size={14} /> Back to Applications
      </button>

      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>{app.driveTitle}</h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B', fontWeight: 600 }}>{app.companyName} · {app.jobRole}</p>
          </div>
          <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 700, color: '#2563EB', background: '#EFF6FF' }}>
            Current Status: {app.status?.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Status Timeline */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Application Lifecycle History
        </h3>

        <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid #E2E8F0' }}>
          {history.map((h, i) => (
            <div key={h.id || i} style={{ position: 'relative', marginBottom: i < history.length - 1 ? '24px' : 0 }}>
              {/* Circle dot */}
              <div style={{
                position: 'absolute', left: '-31px', top: '2px',
                width: '12px', height: '12px', borderRadius: '50%',
                background: i === history.length - 1 ? '#2563EB' : '#94A3B8',
                border: '2px solid #fff', boxShadow: '0 0 0 2px #E2E8F0'
              }} />

              <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px 16px', border: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>{h.status?.replace('_', ' ')}</span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>{h.createdAt ? new Date(h.createdAt).toLocaleString() : ''}</span>
                </div>
                {h.comment && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#475569' }}>{h.comment}</p>}
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#94A3B8' }}>Changed by: {h.changedByUsername || 'System'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
