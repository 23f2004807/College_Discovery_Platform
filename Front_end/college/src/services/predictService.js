import apiClient from './apiClient';

export const predictService = {
  getExams: () => apiClient.get('/predict/exams'),
  predict: (exam, value, matchProfile = true, inputMode = 'rank') => {
    const params = new URLSearchParams({
      exam,
      rank: String(value),
      input_mode: inputMode,
      match_profile: matchProfile ? 'true' : 'false',
    });
    return apiClient.get(`/predict?${params.toString()}`);
  },
};
