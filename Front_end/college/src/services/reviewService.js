import apiClient from './apiClient';

export const reviewService = {
  add: (collegeId, data) => apiClient.post(`/colleges/${collegeId}/reviews`, data),
};
