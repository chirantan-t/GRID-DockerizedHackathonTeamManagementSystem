import apiClient from './apiClient';

export const memberService = {
  getMembers: async (teamId) => {
    const response = await apiClient.get(`/api/teams/${teamId}/members`);
    return response.data?.data || response.data || [];
  },

  addMember: async (teamId, memberData) => {
    const response = await apiClient.post(`/api/teams/${teamId}/members`, {
      fullName: memberData.fullName || memberData.name,
      email: memberData.email,
      college: memberData.college || 'VIT Mumbai',
      department: memberData.department || 'Computer Engineering',
      teamRole: memberData.teamRole || 'FULLSTACK'
    });
    return response.data?.data || response.data;
  },

  deleteMember: async (teamId, memberId) => {
    const response = await apiClient.delete(`/api/teams/${teamId}/members/${memberId}`);
    return response.data?.data || response.data;
  }
};

export default memberService;
