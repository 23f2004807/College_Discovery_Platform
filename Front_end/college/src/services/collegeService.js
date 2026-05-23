import apiClient from './apiClient';

export const collegeService = {
  list: (params) => apiClient.get(`/colleges?${params}`),
  getById: (id) => apiClient.get(`/colleges/${id}`),
  getFilters: () => apiClient.get('/colleges/filters'),
  getSimilar: (id) => apiClient.get(`/colleges/${id}/similar`),
  create: (data) => apiClient.post('/colleges', data),
  update: (id, data) => apiClient.put(`/colleges/${id}`, data),
  delete: (id) => apiClient.delete(`/colleges/${id}`),
};
