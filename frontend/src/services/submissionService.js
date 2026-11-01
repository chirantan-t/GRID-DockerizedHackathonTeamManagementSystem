import apiClient from './apiClient';

export const submissionService = {
  createSubmission: async (data) => {
    const response = await apiClient.post('/api/submissions', data);
    return response.data?.data || response.data;
  },

  updateSubmission: async (id, data) => {
    const response = await apiClient.put(`/api/submissions/${id}`, data);
    return response.data?.data || response.data;
  },

  finalizeSubmission: async (id) => {
    const response = await apiClient.post(`/api/submissions/${id}/finalize`);
    return response.data?.data || response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/submissions/${id}`);
    return response.data?.data || response.data;
  },

  getByHackathon: async (hackathonId) => {
    const response = await apiClient.get(`/api/submissions/hackathon/${hackathonId}`);
    return response.data?.data || response.data || [];
  },

  getByTeam: async (teamId) => {
    const response = await apiClient.get(`/api/submissions/team/${teamId}`);
    return response.data?.data || response.data || [];
  }
};

export default submissionService;

