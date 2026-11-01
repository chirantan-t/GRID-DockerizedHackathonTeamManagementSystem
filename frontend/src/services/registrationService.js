import apiClient from './apiClient';

export const registrationService = {
  registerTeam: async (hackathonId, teamId) => {
    const response = await apiClient.post('/api/registrations', {
      hackathonId,
      teamId
    });
    return response.data?.data || response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/registrations/${id}`);
    return response.data?.data || response.data;
  },

  getByHackathon: async (hackathonId) => {
    const response = await apiClient.get(`/api/registrations/hackathon/${hackathonId}`);
    return response.data?.data || response.data || [];
  },

  getByTeam: async (teamId) => {
    const response = await apiClient.get(`/api/registrations/team/${teamId}`);
    return response.data?.data || response.data || [];
  },

  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`/api/registrations/${id}/status`, { status });
    return response.data?.data || response.data;
  }
};

export default registrationService;

