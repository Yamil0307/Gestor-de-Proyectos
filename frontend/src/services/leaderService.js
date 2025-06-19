import api from './authService';

export const leaderService = {
  // Obtener todos los líderes
  async getLeaders(skip = 0, limit = 100) {
    try {
      const response = await api.get(`/leaders/?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Obtener líder por ID
  async getLeader(id) {
    try {
      const response = await api.get(`/leaders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Crear nuevo líder
  async createLeader(leaderData) {
    try {
      const response = await api.post('/leaders/', leaderData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Actualizar líder
  async updateLeader(id, leaderData) {
    try {
      const response = await api.put(`/leaders/${id}`, leaderData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Eliminar líder
  async deleteLeader(id) {
    try {
      const response = await api.delete(`/leaders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};