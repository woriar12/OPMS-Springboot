import React, { useState, useEffect } from 'react';
import { companyService } from '../../services/companyService';
import { adminService } from '../../services/adminService';
import { X, Edit3, CheckCircle2, AlertCircle } from 'lucide-react';

export const CompanyDriveEditModal = ({ drive, isOpen, onClose, onDriveUpdated }) => {
  const [departments, setDepartments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    jobRole: '',
    description: '',
    industry: '',
    jobType: 'FULL_TIME',
    location: '',
    workMode: 'ON_SITE',
    salaryMin: '',
    salaryMax: '',
    salaryDescription: '',
    applicationStartDate: '',
    applicationDeadline: '',
    driveDate: '',
    minimumCgpa: 0.0,
    maximumBacklogs: 0,
    graduationBatch: '',
    requiredSkills: '',
    departmentIds: [],
  });

  useEffect(() => {
    // Load departments list for department selection
    companyService.getDepartments().then(setDepartments).catch(() => {});
  }, []);

  useEffect(() => {
    if (drive) {
      setFormData({
        title: drive.title || '',
        jobRole: drive.jobRole || '',
        description: drive.description || '',
        industry: drive.industry || '',
        jobType: drive.jobType || 'FULL_TIME',
        location: drive.location || '',
        workMode: drive.workMode || 'ON_SITE',
        salaryMin: drive.salaryMin || '',
        salaryMax: drive.salaryMax || '',
        salaryDescription: drive.salaryDescription || '',
        applicationStartDate: drive.applicationStartDate ? drive.applicationStartDate.substring(0, 10) : '',
        applicationDeadline: drive.applicationDeadline ? drive.applicationDeadline.substring(0, 10) : '',
        driveDate: drive.driveDate ? drive.driveDate.substring(0, 10) : '',
        minimumCgpa: drive.minimumCgpa ?? 0.0,
        maximumBacklogs: drive.maximumBacklogs ?? 0,
        graduationBatch: drive.graduationBatch || '',
        requiredSkills: drive.requiredSkills || '',
        departmentIds: drive.eligibleDepartments ? drive.eligibleDepartments.map(d => d.id) : [],
      });
    }
  }, [drive]);

  if (!isOpen || !drive) return null;

  const handleDeptToggle = (deptId) => {
    setFormData(prev => {
      const exists = prev.departmentIds.includes(deptId);
      return {
        ...prev,
        departmentIds: exists ? prev.departmentIds.filter(id => id !== deptId) : [...prev.departmentIds, deptId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setSubmitting(true);
      const updated = await companyService.updateDrive(drive.id, {
        ...formData,
        minimumCgpa: Number(formData.minimumCgpa),
        maximumBacklogs: Number(formData.maximumBacklogs),
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
      });

      setSuccess('Drive details updated successfully!');
      if (onDriveUpdated) onDriveUpdated(updated);
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update drive details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Edit Placement Drive</h3>
              <p className="text-xs text-slate-500">{drive.companyName} • {drive.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Drive Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Job Role *</label>
              <input
                type="text"
                required
                value={formData.jobRole}
                onChange={e => setFormData({ ...formData, jobRole: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Minimum CGPA *</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                value={formData.minimumCgpa}
                onChange={e => setFormData({ ...formData, minimumCgpa: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Maximum Backlogs *</label>
              <input
                type="number"
                min="0"
                required
                value={formData.maximumBacklogs}
                onChange={e => setFormData({ ...formData, maximumBacklogs: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Salary Min (LPA)</label>
              <input
                type="number"
                step="0.1"
                value={formData.salaryMin}
                onChange={e => setFormData({ ...formData, salaryMin: e.target.value })}
                placeholder="e.g. 4.5"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Salary Max (LPA)</label>
              <input
                type="number"
                step="0.1"
                value={formData.salaryMax}
                onChange={e => setFormData({ ...formData, salaryMax: e.target.value })}
                placeholder="e.g. 7.0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Application Deadline</label>
              <input
                type="date"
                value={formData.applicationDeadline}
                onChange={e => setFormData({ ...formData, applicationDeadline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Location / Work Mode</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Chennai / Remote"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Job Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Eligible Departments</label>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              {departments.map(dept => {
                const isSelected = formData.departmentIds.includes(dept.id);
                return (
                  <button
                    type="button"
                    key={dept.id}
                    onClick={() => handleDeptToggle(dept.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {dept.departmentCode} - {dept.departmentName}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20"
            >
              {submitting ? 'Saving Changes...' : 'Save Drive Updates'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
