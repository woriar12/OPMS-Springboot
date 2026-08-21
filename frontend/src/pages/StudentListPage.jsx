import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { Search, Filter, Eye, Edit3, X, UserCheck, GraduationCap, ShieldCheck, UserPlus, MapPin, CheckCircle2, AlertCircle, Mail } from 'lucide-react';

export const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [resendingId, setResendingId] = useState(null);
  const [toast, setToast] = useState('');

  const handleResendCredentials = async (student) => {
    try {
      setResendingId(student.id);
      await adminService.resendCredentials(student.id);
      setToast(`Credentials successfully sent to ${student.email || student.studentName}!`);
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resend credentials');
    } finally {
      setResendingId(null);
    }
  };

  // Edit Student Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    studentName: '',
    email: '',
    departmentId: '',
    batch: '',
    currentSemester: 6,
    cgpa: 0.0,
    activeBacklogs: 0,
    address: '',
    college: '',
    university: '',
  });

  const openEditModal = (student) => {
    setEditingStudent(student);
    setEditFormData({
      studentName: student.studentName || '',
      email: student.email || '',
      departmentId: student.departmentId || '',
      batch: student.batch || '2023-2027',
      currentSemester: student.currentSemester || 6,
      cgpa: student.cgpa || 0.0,
      activeBacklogs: student.activeBacklogs || 0,
      address: student.address || '',
      college: student.college || 'N.S.N College Of Engineering And Technology',
      university: student.university || 'Anna University',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      const updated = await adminService.updateStudent(editingStudent.id, editFormData);
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? updated : s));
      if (selectedStudent?.id === editingStudent.id) {
        setSelectedStudent(updated);
      }
      setIsEditModalOpen(false);
      setToast(`Successfully updated master details & email for ${updated.studentName}!`);
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update student profile');
    } finally {
      setSubmitting(false);
    }
  };

  // Add Single Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    rollNumber: '',
    registerNumber: '',
    departmentId: '',
    college: 'N.S.N College Of Engineering And Technology',
    university: 'Anna University',
    batch: '2023-2027',
    currentSemester: 6,
    cgpa: 7.5,
    activeBacklogs: 0,
    address: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentData, deptData] = await Promise.all([
        adminService.getStudents({ departmentId: deptFilter || null, search }),
        adminService.getDepartments(),
      ]);
      setStudents(studentData);
      setDepartments(deptData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [deptFilter, search]);

  const openDetailModal = (student) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.studentName.trim() || !formData.email.trim() || !formData.registerNumber.trim() || !formData.rollNumber.trim() || !formData.departmentId) {
      setFormError('Please fill in all required fields (Name, Email, Roll No, Reg No, Department)');
      return;
    }

    try {
      setSubmitting(true);
      const newStudent = await adminService.createStudent({
        ...formData,
        departmentId: Number(formData.departmentId),
        currentSemester: Number(formData.currentSemester),
        cgpa: Number(formData.cgpa),
        activeBacklogs: Number(formData.activeBacklogs),
      });

      setFormSuccess(`Student ${newStudent.studentName} (${newStudent.registerNumber}) created successfully!`);
      setFormData({
        studentName: '',
        email: '',
        rollNumber: '',
        registerNumber: '',
        departmentId: departments[0]?.id || '',
        college: 'N.S.N College Of Engineering And Technology',
        university: 'Anna University',
        batch: '2023-2027',
        currentSemester: 6,
        cgpa: 7.5,
        activeBacklogs: 0,
        address: '',
      });
      fetchData();
      setTimeout(() => {
        setIsAddModalOpen(false);
        setFormSuccess('');
      }, 2000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create student account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Master record of all active students onboarded in OPMS</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setFormError('');
              setFormSuccess('');
              if (departments.length > 0 && !formData.departmentId) {
                setFormData(prev => ({ ...prev, departmentId: departments[0].id }));
              }
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            + Add Single Student
          </button>
          <span className="text-xs font-bold px-3 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
            Total: {students.length}
          </span>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name, Reg No, Roll No..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Filter className="w-4 h-4" />
            Branch:
          </div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.departmentCode} - {d.departmentName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">Register No</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Batch / Sem</th>
                <th className="px-6 py-4">CGPA</th>
                <th className="px-6 py-4">Backlogs</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                    Loading student directory...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">{student.registerNumber}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{student.studentName}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg border border-indigo-100 text-[11px]">
                        {student.departmentCode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {student.batch} <span className="text-slate-400">(Sem {student.currentSemester})</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{student.cgpa}</td>
                    <td className="px-6 py-4">
                      {student.activeBacklogs > 0 ? (
                        <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100">
                          {student.activeBacklogs} Backlogs
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-semibold">0</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(student)}
                        className="p-1.5 hover:bg-amber-50 rounded-lg text-slate-500 hover:text-amber-600 transition-colors"
                        title="Edit Master Data & Email"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleResendCredentials(student)}
                        disabled={resendingId === student.id}
                        className="p-1.5 hover:bg-emerald-50 rounded-lg text-slate-500 hover:text-emerald-600 transition-colors disabled:opacity-50"
                        title="Resend Login Credentials Mail"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDetailModal(student)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
                        title="View Master Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Single Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Add Single Student</h3>
                  <p className="text-xs text-slate-500">Create student master record & auto-generate user account</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {formSuccess}
              </div>
            )}

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                {formError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="e.g. Sanjay Kumar J"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. sanjay@gmail.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Register Number (Username) *</label>
                  <input
                    type="text"
                    required
                    value={formData.registerNumber}
                    onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                    placeholder="e.g. 920923104044"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-blue-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    placeholder="e.g. 23CS0R44"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                  <select
                    required
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.departmentCode} - {d.departmentName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batch</label>
                  <input
                    type="text"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    placeholder="e.g. 2023-2027"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={formData.currentSemester}
                    onChange={(e) => setFormData({ ...formData, currentSemester: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Active Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.activeBacklogs}
                    onChange={(e) => setFormData({ ...formData, activeBacklogs: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">College</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address (Master Data)</label>
                <textarea
                  rows="2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 123, South Car Street, Karur, Tamil Nadu - 639001"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20"
                >
                  {submitting ? 'Creating Student...' : 'Create Student Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Master Data & Email Modal */}
      {isEditModalOpen && editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 font-bold flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Edit Master Profile & Email</h3>
                  <p className="text-xs text-slate-400 font-mono">{editingStudent.registerNumber} • {editingStudent.rollNumber}</p>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={editFormData.studentName}
                  onChange={(e) => setEditFormData({ ...editFormData, studentName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address * (For Notifications & Credentials)</label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  placeholder="student@nsn.ac.in"
                  className="w-full px-3 py-2 bg-amber-50/50 border border-amber-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                  <select
                    required
                    value={editFormData.departmentId}
                    onChange={(e) => setEditFormData({ ...editFormData, departmentId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.departmentCode} - {d.departmentName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batch</label>
                  <input
                    type="text"
                    value={editFormData.batch}
                    onChange={(e) => setEditFormData({ ...editFormData, batch: e.target.value })}
                    placeholder="e.g. 2023-2027"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={editFormData.currentSemester}
                    onChange={(e) => setEditFormData({ ...editFormData, currentSemester: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={editFormData.cgpa}
                    onChange={(e) => setEditFormData({ ...editFormData, cgpa: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Active Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    value={editFormData.activeBacklogs}
                    onChange={(e) => setEditFormData({ ...editFormData, activeBacklogs: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">College</label>
                  <input
                    type="text"
                    value={editFormData.college}
                    onChange={(e) => setEditFormData({ ...editFormData, college: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address (Master Data)</label>
                <textarea
                  rows="2"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  placeholder="Address..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/20"
                >
                  {submitting ? 'Saving Changes...' : 'Save Master Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {isDetailModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedStudent.studentName}</h3>
                  <p className="text-xs font-mono text-slate-400">{selectedStudent.registerNumber}</p>
                </div>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-6 text-xs">
              <div>
                <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-3">Admin Master Data</h4>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div>
                    <span className="text-slate-400">Roll Number:</span>
                    <p className="font-semibold text-slate-800">{selectedStudent.rollNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Department:</span>
                    <p className="font-semibold text-blue-600">{selectedStudent.departmentName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">College:</span>
                    <p className="font-semibold text-slate-800">{selectedStudent.college}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">University:</span>
                    <p className="font-semibold text-slate-800">{selectedStudent.university}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Batch / Semester:</span>
                    <p className="font-semibold text-slate-800">{selectedStudent.batch} (Sem {selectedStudent.currentSemester})</p>
                  </div>
                  <div>
                    <span className="text-slate-400">CGPA / Backlogs:</span>
                    <p className="font-semibold text-slate-800">{selectedStudent.cgpa} CGPA ({selectedStudent.activeBacklogs} backlogs)</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> Address:
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedStudent.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-3">Student Career Links</h4>
                <div className="space-y-2 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p><span className="text-slate-400">Skills:</span> {selectedStudent.skills || 'Not updated'}</p>
                  <p><span className="text-slate-400">GitHub:</span> {selectedStudent.githubUrl || 'N/A'}</p>
                  <p><span className="text-slate-400">LinkedIn:</span> {selectedStudent.linkedinUrl || 'N/A'}</p>
                  <p><span className="text-slate-400">Portfolio:</span> {selectedStudent.portfolioUrl || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleResendCredentials(selectedStudent)}
                  disabled={resendingId === selectedStudent.id}
                  className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl flex items-center gap-2 border border-emerald-200 transition-colors disabled:opacity-50"
                >
                  <Mail className="w-4 h-4 text-emerald-600" />
                  {resendingId === selectedStudent.id ? 'Sending Credentials...' : 'Resend Login Credentials Email'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
