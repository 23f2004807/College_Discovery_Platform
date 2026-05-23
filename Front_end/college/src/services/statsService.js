import apiClient from './apiClient';

export const statsService = {
  getPlatformStats: () => apiClient.get('/stats'),
};
