import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import { adminService } from '../../services/adminService';
import { ArrowLeft, Briefcase, AlertCircle } from 'lucide-react';

export const CompanyDriveCreate = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    jobRole: '',
    description: '',
    industry: '',
    jobType: 'Full Time',
    location: '',
    workMode: 'Onsite',
    salaryMin: '',
    salaryMax: '',
    salaryDescription: '',
    applicationStartDate: '',
    applicationDeadline: '',
    driveDate: '',
    minimumCgpa: '6.0',
    maximumBacklogs: '0',
    graduationBatch: '2026',
    requiredSkills: '',
    departmentIds: [],
  });

  useEffect(() => {
    adminService.getDepartments().then(setDepartments).catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeptToggle = (deptId) => {
    const current = formData.departmentIds;
    if (current.includes(deptId)) {
      setFormData({ ...formData, departmentIds: current.filter(id => id !== deptId) });
    } else {
      setFormData({ ...formData, departmentIds: [...current, deptId] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
        minimumCgpa: formData.minimumCgpa ? parseFloat(formData.minimumCgpa) : 0,
        maximumBacklogs: formData.maximumBacklogs ? parseInt(formData.maximumBacklogs) : 0,
      };

      await companyService.createDrive(payload);
      navigate('/company/drives');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create drive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '820px' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
        <ArrowLeft size={14} /> Back
      </button>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1E293B' }}>Create Placement Drive</h1>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>Fill details to publish a new placement drive</p>
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#DC2626', fontSize: '13px' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '28px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>Basic Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Drive Title *</label>
            <input name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Software Engineer Hiring Drive 2026"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Job Role *</label>
            <input name="jobRole" required value={formData.jobRole} onChange={handleChange} placeholder="e.g. Graduate Engineer Trainee"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Job Description *</label>
            <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} placeholder="Detailed role description, responsibilities, selection process..."
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '20px 0' }} />

        <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>Job & Package Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Job Type</label>
            <select name="jobType" value={formData.jobType} onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
              <option value="Full Time">Full Time</option>
              <option value="Internship">Internship</option>
              <option value="Internship + PPO">Internship + PPO</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Work Mode</label>
            <select name="workMode" value={formData.workMode} onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Location</label>
            <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Bangalore, Chennai"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Min Salary (LPA)</label>
            <input name="salaryMin" type="number" step="0.1" value={formData.salaryMin} onChange={handleChange} placeholder="e.g. 6.5"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Max Salary (LPA)</label>
            <input name="salaryMax" type="number" step="0.1" value={formData.salaryMax} onChange={handleChange} placeholder="e.g. 10.0"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Salary Description</label>
            <input name="salaryDescription" value={formData.salaryDescription} onChange={handleChange} placeholder="e.g. ₹8 LPA fixed + ₹2 LPA variable"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '20px 0' }} />

        <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>Eligibility Criteria</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Minimum CGPA</label>
            <input name="minimumCgpa" type="number" step="0.1" value={formData.minimumCgpa} onChange={handleChange} placeholder="6.0"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Max Active Backlogs</label>
            <input name="maximumBacklogs" type="number" value={formData.maximumBacklogs} onChange={handleChange} placeholder="0"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Graduation Batch</label>
            <input name="graduationBatch" value={formData.graduationBatch} onChange={handleChange} placeholder="e.g. 2026"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Required Skills</label>
            <input name="requiredSkills" value={formData.requiredSkills} onChange={handleChange} placeholder="e.g. Java, Spring Boot, MySQL, React"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Eligible Departments (leave unselected for ALL)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {departments.map(dept => {
                const selected = formData.departmentIds.includes(dept.id);
                return (
                  <button type="button" key={dept.id} onClick={() => handleDeptToggle(dept.id)} style={{
                    padding: '6px 12px', borderRadius: '20px', border: '1px solid',
                    borderColor: selected ? '#7C3AED' : '#E2E8F0',
                    background: selected ? '#F5F3FF' : '#fff',
                    color: selected ? '#7C3AED' : '#475569',
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  }}>
                    {selected ? '✓ ' : ''}{dept.departmentCode}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '20px 0' }} />

        <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>Timeline</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Start Date</label>
            <input name="applicationStartDate" type="date" value={formData.applicationStartDate} onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Deadline</label>
            <input name="applicationDeadline" type="date" value={formData.applicationDeadline} onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Drive Date</label>
            <input name="driveDate" type="date" value={formData.driveDate} onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="button" onClick={() => navigate('/company/drives')} style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
          <button type="submit" disabled={loading} style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
            {loading ? 'Creating...' : 'Save as Draft'}
          </button>
        </div>
      </form>
    </div>
  );
};
