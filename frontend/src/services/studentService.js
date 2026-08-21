import apiClient from './apiClient';

export const studentService = {
  // Master Profile
  getMyProfile: () => apiClient.get('/api/student/profile').then(r => r.data),
  getProfile: () => apiClient.get('/api/student/profile').then(r => r.data),
  updateMyProfile: (data) => apiClient.put('/api/student/profile', data).then(r => r.data),
  updateCareerProfile: (data) => apiClient.put('/api/student/profile', data).then(r => r.data),

  // Correction Request
  submitCorrectionRequest: (data) => apiClient.post('/api/student/correction-requests', data).then(r => r.data),
  createCorrectionRequest: (data) => apiClient.post('/api/student/correction-requests', data).then(r => r.data),
  getMyCorrectionRequests: () => apiClient.get('/api/student/correction-requests').then(r => r.data),

  // Phase 3 Extensions
  getDashboardStats: () => apiClient.get('/api/student/dashboard/stats').then(r => r.data),
  getEligibleDrives: () => apiClient.get('/api/student/drives/eligible').then(r => r.data),
  getDriveById: (id) => apiClient.get(`/api/student/drives/${id}`).then(r => r.data),
  applyForDrive: (driveId, data) => apiClient.post(`/api/student/drives/${driveId}/apply`, data).then(r => r.data),
  getMyApplications: () => apiClient.get('/api/student/applications').then(r => r.data),
  getApplicationById: (id) => apiClient.get(`/api/student/applications/${id}`).then(r => r.data),
  getApplicationHistory: (id) => apiClient.get(`/api/student/applications/${id}/history`).then(r => r.data),
  getMyInterviews: () => apiClient.get('/api/student/interviews').then(r => r.data),
  getMyOffers: () => apiClient.get('/api/student/offers').then(r => r.data),
  respondToOffer: (offerId, data) => apiClient.put(`/api/student/offers/${offerId}/respond`, data).then(r => r.data),
  getMyPlacement: () => apiClient.get('/api/student/placement').then(r => r.data),
};
