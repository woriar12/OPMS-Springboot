import apiClient from './apiClient';

export const officerService = {
  getDashboardStats: () => apiClient.get('/api/officer/dashboard/stats').then(r => r.data),
  getMyProfile: () => apiClient.get('/api/officer/profile').then(r => r.data),
  getDepartments: () => apiClient.get('/api/officer/departments').then(r => r.data),

  // Company requests
  getPendingCompanies: () => apiClient.get('/api/officer/company-requests').then(r => r.data),
  getAllCompanies: () => apiClient.get('/api/officer/companies').then(r => r.data),
  getCompanyById: (id) => apiClient.get(`/api/officer/companies/${id}`).then(r => r.data),
  approveCompany: (id, data) => apiClient.put(`/api/officer/company-requests/${id}/approve`, data).then(r => r.data),
  rejectCompany: (id, data) => apiClient.put(`/api/officer/company-requests/${id}/reject`, data).then(r => r.data),

  // Drives
  getAllDrives: () => apiClient.get('/api/officer/drives').then(r => r.data),
  getPendingDrives: () => apiClient.get('/api/officer/drive-requests').then(r => r.data),
  getDriveById: (id) => apiClient.get(`/api/officer/drives/${id}`).then(r => r.data),
  approveDrive: (id, data) => apiClient.put(`/api/officer/drives/${id}/approve`, data).then(r => r.data),
  rejectDrive: (id, data) => apiClient.put(`/api/officer/drives/${id}/reject`, data).then(r => r.data),
  updateDriveDepartments: (id, departmentIds) => apiClient.put(`/api/officer/drives/${id}/departments`, { departmentIds }).then(r => r.data),

  // Phase 3 Monitoring & Reports
  getAllApplications: () => apiClient.get('/api/officer/applications/all').then(r => r.data),
  getAllInterviews: () => apiClient.get('/api/officer/interviews/all').then(r => r.data),
  getAllOffers: () => apiClient.get('/api/officer/offers/all').then(r => r.data),
  getAllPlacements: () => apiClient.get('/api/officer/placements/all').then(r => r.data),
  getOverallReport: () => apiClient.get('/api/officer/reports/overall').then(r => r.data),
  getDepartmentReports: () => apiClient.get('/api/officer/reports/department').then(r => r.data),
  exportPlacementCsv: () => apiClient.get('/api/officer/reports/export', { responseType: 'blob' }),
};
