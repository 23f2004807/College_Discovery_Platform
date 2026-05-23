import apiClient from './apiClient';

export const savedService = {
  list: () => apiClient.get('/saved'),
  toggle: (collegeId) => apiClient.post('/saved/toggle', { college_id: collegeId }),
};
