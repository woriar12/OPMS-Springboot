import apiClient from './apiClient';

export const companyService = {
  // Public - no auth needed
  registerCompany: (data) => apiClient.post('/api/companies/register', data).then(r => r.data),

  // Company (authenticated)
  getDashboardStats: () => apiClient.get('/api/company/dashboard/stats').then(r => r.data),
  getMyProfile: () => apiClient.get('/api/company/profile').then(r => r.data),
  updateMyProfile: (data) => apiClient.put('/api/company/profile', data).then(r => r.data),
  getDepartments: () => apiClient.get('/api/company/departments').then(r => r.data),

  // Drives
  createDrive: (data) => apiClient.post('/api/company/drives', data).then(r => r.data),
  getMyDrives: () => apiClient.get('/api/company/drives').then(r => r.data),
  getDriveById: (id) => apiClient.get(`/api/company/drives/${id}`).then(r => r.data),
  updateDrive: (id, data) => apiClient.put(`/api/company/drives/${id}`, data).then(r => r.data),
  submitDrive: (id) => apiClient.post(`/api/company/drives/${id}/submit`).then(r => r.data),

  // Phase 3 Applications & Recruitment
  getCompanyApplications: () => apiClient.get('/api/company/applications').then(r => r.data),
  getApplicationById: (id) => apiClient.get(`/api/company/applications/${id}`).then(r => r.data),
  shortlistApplication: (id, data) => apiClient.put(`/api/company/applications/${id}/shortlist`, data).then(r => r.data),
  rejectApplication: (id, data) => apiClient.put(`/api/company/applications/${id}/reject`, data).then(r => r.data),
  scheduleInterview: (applicationId, data) => apiClient.post(`/api/company/applications/${applicationId}/interviews`, data).then(r => r.data),
  getCompanyInterviews: () => apiClient.get('/api/company/interviews').then(r => r.data),
  updateInterviewResult: (interviewId, data) => apiClient.put(`/api/company/interviews/${interviewId}/result`, data).then(r => r.data),
  generateOffer: (applicationId, data) => apiClient.post(`/api/company/applications/${applicationId}/offers`, data).then(r => r.data),
  getCompanyOffers: () => apiClient.get('/api/company/offers').then(r => r.data),
  getCompanyPlacements: () => apiClient.get('/api/company/placements').then(r => r.data),
};

export const notificationService = {
  getAll: () => apiClient.get('/api/notifications').then(r => r.data),
  getUnreadCount: () => apiClient.get('/api/notifications/unread-count').then(r => r.data),
  markAsRead: (id) => apiClient.patch(`/api/notifications/${id}/read`).then(r => r.data),
  markAllAsRead: () => apiClient.patch('/api/notifications/read-all').then(r => r.data),
};
