import apiClient from './apiClient';

export const evaluationService = {
  createEvaluation: async (data) => {
    const response = await apiClient.post('/api/evaluations', data);
    return response.data?.data || response.data;
  },

  updateEvaluation: async (id, data) => {
    const response = await apiClient.put(`/api/evaluations/${id}`, data);
    return response.data?.data || response.data;
  },

  getBySubmission: async (submissionId) => {
    const response = await apiClient.get(`/api/evaluations/submission/${submissionId}`);
    return response.data?.data || response.data || [];
  },

  getSummary: async (submissionId) => {
    const response = await apiClient.get(`/api/evaluations/submission/${submissionId}/summary`);
    return response.data?.data || response.data;
  }
};

export default evaluationService;

