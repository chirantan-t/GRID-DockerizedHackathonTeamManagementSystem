import apiClient from './apiClient';

export const userService = {
  getProfile: async () => {
    const response = await apiClient.get('/api/users/profile');
    return response.data?.data || response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.put('/api/users/profile', data);
    return response.data?.data || response.data;
  },

  updateStatus: async (userId, active) => {
    const response = await apiClient.patch(`/api/users/${userId}/status`, { active });
    return response.data?.data || response.data;
  }
};

export default userService;

