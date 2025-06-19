import api from './authService';

export const programmerService = {
  // Obtener todos los programadores
  async getProgrammers(skip = 0, limit = 100) {
    try {
      const response = await api.get(`/programmers/?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Obtener programador por ID
  async getProgrammer(id) {
    try {
      const response = await api.get(`/programmers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Crear nuevo programador
  async createProgrammer(programmerData) {
    try {
      const response = await api.post('/programmers/', programmerData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Actualizar programador
  async updateProgrammer(id, programmerData) {
    try {
      const response = await api.put(`/programmers/${id}`, programmerData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Eliminar programador
  async deleteProgrammer(id) {
    try {
      const response = await api.delete(`/programmers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};