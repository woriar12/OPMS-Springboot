import apiClient from './apiClient';

export const adminService = {
  getDashboardStats: () => apiClient.get('/api/admin/dashboard/stats').then(r => r.data),

  // Departments
  getDepartments: () => apiClient.get('/api/admin/departments').then(r => r.data),
  createDepartment: (data) => apiClient.post('/api/admin/departments', data).then(r => r.data),
  updateDepartment: (id, data) => apiClient.put(`/api/admin/departments/${id}`, data).then(r => r.data),
  deleteDepartment: (id) => apiClient.delete(`/api/admin/departments/${id}`).then(r => r.data),

  // Students
  getStudents: (params) => apiClient.get('/api/admin/students', { params }).then(r => r.data),
  getStudentById: (id) => apiClient.get(`/api/admin/students/${id}`).then(r => r.data),
  createStudent: (data) => apiClient.post('/api/admin/students', data).then(r => r.data),
  updateStudent: (id, data) => apiClient.put(`/api/admin/students/${id}`, data).then(r => r.data),
  resendCredentials: (id) => apiClient.post(`/api/admin/students/${id}/resend-credentials`).then(r => r.data),
  importStudents: (fileOrFormData) => {
    let formData = fileOrFormData;
    if (!(fileOrFormData instanceof FormData)) {
      formData = new FormData();
      formData.append('file', fileOrFormData);
    }
    return apiClient.post('/api/admin/students/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },
  downloadTemplate: () => apiClient.get('/api/admin/students/sample-import-template', { responseType: 'blob' }),

  // Correction Requests
  getCorrectionRequests: () => apiClient.get('/api/admin/correction-requests').then(r => r.data),
  approveCorrectionRequest: (id, comment) => apiClient.post(`/api/admin/correction-requests/${id}/approve`, { adminComment: comment }).then(r => r.data),
  approveCorrection: (id, comment) => apiClient.post(`/api/admin/correction-requests/${id}/approve`, { adminComment: comment }).then(r => r.data),
  rejectCorrectionRequest: (id, comment) => apiClient.post(`/api/admin/correction-requests/${id}/reject`, { adminComment: comment }).then(r => r.data),
  rejectCorrection: (id, comment) => apiClient.post(`/api/admin/correction-requests/${id}/reject`, { adminComment: comment }).then(r => r.data),

  // Audit Logs
  getAuditLogs: () => apiClient.get('/api/admin/audit-logs').then(r => r.data),

  // Placement Officers (Phase 2)
  getOfficers: () => apiClient.get('/api/admin/officers').then(r => r.data),
  createOfficer: (data) => apiClient.post('/api/admin/officers', data).then(r => r.data),
  updateOfficer: (id, data) => apiClient.put(`/api/admin/officers/${id}`, data).then(r => r.data),
  updateOfficerStatus: (id, status) => apiClient.patch(`/api/admin/officers/${id}/status`, { status }).then(r => r.data),
};
