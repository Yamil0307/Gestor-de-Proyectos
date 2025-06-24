import api from './authService';
import { processApiError } from '../utils/errorUtils';

export const programmerService = {
  // Obtener todos los programadores
  async getProgrammers(skip = 0, limit = 100) {
    try {
      const response = await api.get(`/programmers/?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      const formattedError = processApiError(error, { 
        defaultMessage: 'Error al obtener la lista de programadores' 
      });
      throw formattedError;
    }
  },

  // Obtener programador por ID
  async getProgrammer(id) {
    try {
      const response = await api.get(`/programmers/${id}`);
      return response.data;
    } catch (error) {
      const formattedError = processApiError(error, { 
        defaultMessage: `Error al obtener el programador con ID ${id}` 
      });
      throw formattedError;
    }
  },

  // Crear nuevo programador
  async createProgrammer(programmerData) {
    try {
      const response = await api.post('/programmers/', programmerData);
      return response.data;
    } catch (error) {
      const formattedError = processApiError(error, { 
        defaultMessage: 'Error al crear el programador' 
      });
      throw formattedError;
    }
  },

  // Actualizar programador
  async updateProgrammer(id, programmerData) {
    try {
      const response = await api.put(`/programmers/${id}`, programmerData);
      return response.data;
    } catch (error) {
      const formattedError = processApiError(error, { 
        defaultMessage: `Error al actualizar el programador con ID ${id}` 
      });
      throw formattedError;
    }
  },

  // Eliminar programador
  async deleteProgrammer(id) {
    try {
      const response = await api.delete(`/programmers/${id}`);
      return response.data;
    } catch (error) {
      const formattedError = processApiError(error, { 
        defaultMessage: `Error al eliminar el programador con ID ${id}` 
      });
      throw formattedError;
    }
  },

  // Obtener los lenguajes de un programador
  async getProgrammerLanguages(id) {
    try {
      const response = await api.get(`/programmers/${id}/languages`);
      return response.data;
    } catch (error) {
      const formattedError = processApiError(error, { 
        defaultMessage: `Error al obtener los lenguajes del programador con ID ${id}` 
      });
      throw formattedError;
    }
  },

  // Obtener el proyecto de un programador por su carnet de identidad
  async getProjectByProgrammerIdentity(identityCard) {
    try {
      const response = await api.get(`/programmers/by-identity/${identityCard}/project`);
      return response.data;
    } catch (error) {
      const formattedError = processApiError(error, { 
        defaultMessage: `No se encontró ningún proyecto asignado al programador con carnet ${identityCard}` 
      });
      throw formattedError;
    }
  }
};