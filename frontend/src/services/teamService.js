import apiClient from './apiClient';

export const teamService = {
  getTeams: async (params = {}) => {
    const response = await apiClient.get('/api/teams', { params });
    return response.data?.data || response.data || [];
  },

  searchTeams: async (query, params = {}) => {
    const response = await apiClient.get('/api/teams/search', {
      params: { q: query, ...params }
    });
    return response.data?.data || response.data || [];
  },

  getTeamById: async (id) => {
    const response = await apiClient.get(`/api/teams/${id}`);
    return response.data?.data || response.data;
  },

  getMyTeams: async () => {
    try {
      const response = await apiClient.get('/api/teams/my');
      const data = response.data?.data || response.data;
      if (Array.isArray(data)) return data;
      if (data && typeof data === 'object' && data.id) return [data];
      return [];
    } catch (_e) {
      try {
        const alt = await apiClient.get('/api/teams/my-team');
        const d = alt.data?.data || alt.data;
        if (d && d.id) return [d];
      } catch (_e2) {}
      return [];
    }
  },

  getMyTeam: async () => {
    try {
      const response = await apiClient.get('/api/teams/my-team');
      return response.data?.data || response.data || null;
    } catch (_e) {
      try {
        const alt = await apiClient.get('/api/teams/my');
        return alt.data?.data || alt.data || null;
      } catch (_e2) {
        return null;
      }
    }
  },

  createTeam: async (teamData) => {
    const payload = {
      teamName: teamData.teamName || teamData.name,
      teamCode: (teamData.teamCode || teamData.teamTag || 'TEAM-' + Date.now().toString().slice(-4)).toUpperCase(),
      projectTitle: teamData.projectTitle || 'Autonomous System Project',
      projectDescription: teamData.projectDescription || teamData.description || 'Hackathon engineering solution',
      teamLead: teamData.teamLead || 'Team Lead',
      track: teamData.track || 'AI_ML'
    };
    const response = await apiClient.post('/api/teams', payload);
    return response.data?.data || response.data;
  },

  updateTeam: async (id, teamData) => {
    const response = await apiClient.put(`/api/teams/${id}`, teamData);
    return response.data?.data || response.data;
  },

  deleteTeam: async (id) => {
    const response = await apiClient.delete(`/api/teams/${id}`);
    return response.data?.data || response.data;
  }
};

export default teamService;
