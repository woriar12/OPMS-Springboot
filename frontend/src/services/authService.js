import apiClient from './apiClient';

export const authService = {
  async login(username, password) {
    const response = await apiClient.post('/api/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('opms_jwt_token', response.data.token);
      localStorage.setItem('opms_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async getCurrentUser() {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },

  async changePassword(oldPassword, newPassword) {
    const response = await apiClient.post('/api/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  async logout() {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (e) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('opms_jwt_token');
      localStorage.removeItem('opms_user');
    }
  },
};
