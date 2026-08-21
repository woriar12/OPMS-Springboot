import React, { useState, useEffect } from 'react';
import { officerService } from '../../services/officerService';
import { Search, Building2, Check, X, ShieldCheck, Sparkles } from 'lucide-react';

export const OfficerDepartmentMapping = () => {
  const [drives, setDrives] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingDriveId, setUpdatingDriveId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [toast, setToast] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [driveData, deptData] = await Promise.all([
        officerService.getAllDrives(),
        officerService.getDepartments(),
      ]);
      setDrives(driveData);
      setDepartments(deptData);
    } catch (err) {
      console.error('Failed to load matrix data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleDept = async (drive, deptId) => {
    const currentMapped = drive.eligibleDepartments?.map(d => d.id) || [];
    let newDeptIds = [];

    if (currentMapped.length === 0) {
      // If currently all departments are enabled by default, clicking a dept removes it
      newDeptIds = departments.map(d => d.id).filter(id => id !== deptId);
    } else if (currentMapped.includes(deptId)) {
      // Remove department
      newDeptIds = currentMapped.filter(id => id !== deptId);
    } else {
      // Add department
      newDeptIds = [...currentMapped, deptId];
    }

    try {
      setUpdatingDriveId(drive.id);
      const updatedDrive = await officerService.updateDriveDepartments(drive.id, newDeptIds);
      
      // Update local state immediately
      setDrives(prev => prev.map(d => (d.id === drive.id ? updatedDrive : d)));
      
      const deptCode = departments.find(d => d.id === deptId)?.departmentCode || 'Dept';
      const isNowMapped = updatedDrive.eligibleDepartments?.some(d => d.id === deptId);
      
      setToast(`${deptCode} ${isNowMapped ? 'mapped to' : 'unmapped from'} ${drive.companyName}`);
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Failed to update department mapping:', err);
    } finally {
      setUpdatingDriveId(null);
    }
  };

  const filteredDrives = drives.filter(d => {
    const matchSearch = d.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      d.title?.toLowerCase().includes(search.toLowerCase()) ||
      d.jobRole?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || d.status === statusFilter || (statusFilter === 'ACTIVE' && d.status === 'APPROVED');
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16 text-slate-400 text-xs font-medium">
        Loading Placement Officer Mapping Matrix...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Company → Department Mapping Matrix</h1>
          <p className="text-xs text-slate-500 mt-0.5">Click any department checkmark below to instantly map or unmap student branches for placement drives</p>
        </div>

        <div className="flex items-center gap-3">
          {toast && (
            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center gap-1.5 animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              {toast}
            </div>
          )}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active & Approved</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
          </select>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter company/role..."
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none min-w-[180px]"
            />
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      {filteredDrives.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-soft">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">No drive department mapping records found</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-slate-50/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4 w-64">Company & Role</th>
                  <th className="px-4 py-4 text-center">Min CGPA</th>
                  <th className="px-4 py-4 text-center">Max Backlogs</th>
                  {departments.map(dept => (
                    <th key={dept.id} className="px-3 py-4 text-center text-slate-800 font-bold">
                      {dept.departmentCode}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredDrives.map(drive => {
                  const mappedDeptIds = drive.eligibleDepartments?.map(dep => dep.id) || [];
                  const isAllDepts = mappedDeptIds.length === 0;

                  return (
                    <tr key={drive.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-sm">{drive.companyName}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{drive.jobRole} <span className="text-slate-400">({drive.title})</span></p>
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-slate-800">
                        {drive.minimumCgpa ?? '0.0'}
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-slate-800">
                        {drive.maximumBacklogs ?? '0'}
                      </td>
                      {departments.map(dept => {
                        const isEligible = isAllDepts || mappedDeptIds.includes(dept.id);
                        const isUpdating = updatingDriveId === drive.id;

                        return (
                          <td key={dept.id} className="px-3 py-4 text-center">
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleToggleDept(drive, dept.id)}
                              title={`Click to ${isEligible ? 'Unmap' : 'Map'} ${dept.departmentCode} for ${drive.companyName}`}
                              className={`w-7 h-7 rounded-full inline-flex items-center justify-center transition-all duration-200 cursor-pointer ${
                                isEligible
                                  ? 'bg-emerald-100 text-emerald-700 hover:bg-red-100 hover:text-red-600 shadow-xs'
                                  : 'bg-slate-100 text-slate-300 hover:bg-emerald-100 hover:text-emerald-700'
                              }`}
                            >
                              {isEligible ? <Check className="w-4 h-4 stroke-[2.5]" /> : <X className="w-4 h-4 stroke-[2]" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
