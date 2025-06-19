import api from './authService';

export const teamService = {
  // Obtener todos los equipos
  async getTeams(skip = 0, limit = 100) {
    try {
      const response = await api.get(`/teams/?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Obtener equipo por ID
  async getTeam(id) {
    try {
      const response = await api.get(`/teams/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Crear nuevo equipo
  async createTeam(teamData) {
    try {
      const response = await api.post('/teams/', teamData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Actualizar equipo
  async updateTeam(id, teamData) {
    try {
      const response = await api.put(`/teams/${id}`, teamData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Eliminar equipo
  async deleteTeam(id) {
    try {
      const response = await api.delete(`/teams/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Obtener miembros de un equipo
  async getTeamMembers(teamId) {
    try {
      const response = await api.get(`/teams/${teamId}/members`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Agregar miembro a equipo
  async addTeamMember(teamId, programmerId) {
    try {
      const response = await api.post(`/teams/${teamId}/members`, {
        programmer_id: programmerId
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Remover miembro de equipo
  async removeTeamMember(teamId, programmerId) {
    try {
      const response = await api.delete(`/teams/${teamId}/members/${programmerId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};