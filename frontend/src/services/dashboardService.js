import apiClient from './apiClient';

export const dashboardService = {
  getTeamDashboard: async () => {
    const response = await apiClient.get('/api/dashboard/team');
    return response.data?.data || response.data;
  },

  getOrganizerDashboard: async () => {
    const response = await apiClient.get('/api/dashboard/organizer');
    return response.data?.data || response.data;
  },

  getAdminDashboard: async () => {
    const response = await apiClient.get('/api/dashboard/admin');
    return response.data?.data || response.data;
  },

  // Backward compatibility aliases
  getSummary: async () => {
    const response = await apiClient.get('/api/dashboard/admin');
    return response.data?.data || response.data;
  }
};

export default dashboardService;
