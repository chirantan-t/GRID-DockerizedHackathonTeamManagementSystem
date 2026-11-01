import apiClient from './apiClient';

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/api/auth/login', {
      email,
      username: email,
      password
    });
    return response.data;
  },

  register: async ({ fullName, email, password, roleName = 'TEAM' }) => {
    const response = await apiClient.post('/api/auth/register', {
      fullName,
      email,
      password,
      roleName
    });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  }
};

export default authService;

