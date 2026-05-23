import apiClient from './apiClient';

export const authService = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (profile) => apiClient.post('/auth/register', profile),
  me: () => apiClient.get('/auth/me'),
  updateProfile: (profile) => apiClient.put('/auth/me', profile),
  getRegistrationFields: () => apiClient.get('/auth/fields'),
};
