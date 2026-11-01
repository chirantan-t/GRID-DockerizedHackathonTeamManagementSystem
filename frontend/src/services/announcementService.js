import apiClient from './apiClient';

export const announcementService = {
  createAnnouncement: async (data) => {
    const response = await apiClient.post('/api/announcements', data);
    return response.data?.data || response.data;
  },

  updateAnnouncement: async (id, data) => {
    const response = await apiClient.put(`/api/announcements/${id}`, data);
    return response.data?.data || response.data;
  },

  deleteAnnouncement: async (id) => {
    const response = await apiClient.delete(`/api/announcements/${id}`);
    return response.data?.data || response.data;
  },

  getByHackathon: async (hackathonId) => {
    const response = await apiClient.get(`/api/announcements/hackathon/${hackathonId}`);
    return response.data?.data || response.data || [];
  },

  getMyAnnouncements: async () => {
    const response = await apiClient.get('/api/announcements/my');
    return response.data?.data || response.data || [];
  }
};

export default announcementService;

