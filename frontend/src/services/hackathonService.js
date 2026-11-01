import apiClient from './apiClient';

export const hackathonService = {
  getPublished: async () => {
    const response = await apiClient.get('/api/hackathons/published');
    return response.data?.data || response.data || [];
  },

  getAll: async (params = {}) => {
    const response = await apiClient.get('/api/hackathons', { params });
    return response.data?.data || response.data || [];
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/hackathons/${id}`);
    return response.data?.data || response.data;
  },

  getMyHackathons: async () => {
    const response = await apiClient.get('/api/hackathons/my');
    return response.data?.data || response.data || [];
  },

  createHackathon: async (data) => {
    const response = await apiClient.post('/api/hackathons', data);
    return response.data?.data || response.data;
  },

  updateHackathon: async (id, data) => {
    const response = await apiClient.put(`/api/hackathons/${id}`, data);
    return response.data?.data || response.data;
  },

  publishHackathon: async (id) => {
    const response = await apiClient.post(`/api/hackathons/${id}/publish`);
    return response.data?.data || response.data;
  },

  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`/api/hackathons/${id}/status`, { status });
    return response.data?.data || response.data;
  },

  deleteHackathon: async (id) => {
    const response = await apiClient.delete(`/api/hackathons/${id}`);
    return response.data?.data || response.data;
  }
};

export default hackathonService;

