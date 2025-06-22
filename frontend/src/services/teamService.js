import api from './authService';

export const teamService = {
  // Obtener todos los equipos
  async getTeams(skip = 0, limit = 100) {
    try {
      const response = await api.get(`/teams/?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error en getTeams:', error);
      if (error.response) {
        throw error.response.data;
      } else {
        throw {
          detail: error.message || 'Error de conexión con el servidor'
        };
      }
    }
  },

  // Obtener equipo por ID
  async getTeam(id) {
    try {
      const response = await api.get(`/teams/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en getTeam:', error);
      if (error.response) {
        throw error.response.data;
      } else {
        throw {
          detail: error.message || 'Error de conexión con el servidor'
        };
      }
    }
  },

  // Crear nuevo equipo
  async createTeam(teamData) {
    try {
      const response = await api.post('/teams/', teamData);
      return response.data;
    } catch (error) {
      console.error('Error en createTeam:', error);
      if (error.response) {
        throw error.response.data;
      } else {
        // Si no hay respuesta (error de red, CORS, etc.)
        throw {
          detail: error.message || 'Error de conexión con el servidor'
        };
      }
    }
  },

  // Actualizar equipo
  async updateTeam(id, teamData) {
    try {
      const response = await api.put(`/teams/${id}`, teamData);
      return response.data;
    } catch (error) {
      console.error('Error en updateTeam:', error);
      if (error.response) {
        throw error.response.data;
      } else {
        throw {
          detail: error.message || 'Error de conexión con el servidor'
        };
      }
    }
  },

  // Eliminar equipo
  async deleteTeam(id) {
    try {
      const response = await api.delete(`/teams/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en deleteTeam:', error);
      
      // Si hay respuesta del servidor y tiene formato de error específico
      if (error.response && error.response.status === 400) {
        throw {
          detail: error.response.data.detail || 'No se puede eliminar este equipo',
          status: error.response.status
        };
      } else if (error.response) {
        throw error.response.data;
      } else {
        throw {
          detail: error.message || 'Error de conexión con el servidor'
        };
      }
    }
  },

  // Obtener miembros de un equipo
  async getTeamMembers(teamId) {
    try {
      const response = await api.get(`/teams/${teamId}/members`);
      return response.data;
    } catch (error) {
      console.error('Error en getTeamMembers:', error);
      if (error.response) {
        throw error.response.data;
      } else {
        throw {
          detail: error.message || 'Error de conexión con el servidor'
        };
      }
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
      console.error('Error en addTeamMember:', error);
      if (error.response) {
        throw error.response.data;
      } else {
        throw {
          detail: error.message || 'Error de conexión con el servidor'
        };
      }
    }
  },

  // Remover miembro de equipo
  async removeTeamMember(teamId, programmerId) {
    try {
      const response = await api.delete(`/teams/${teamId}/members/${programmerId}`);
      return response.data;
    } catch (error) {
      console.error('Error en removeTeamMember:', error);
      if (error.response) {
        // Si tenemos un error de respuesta del servidor
        if (error.response.status === 422) {
          // Error de validación
          throw {
            detail: error.response.data.detail || 'No se puede remover este miembro del equipo',
            status: 422
          };
        } else {
          throw error.response.data;
        }
      } else {
        // Si no hay respuesta (error de red, CORS, etc.)
        throw {
          detail: error.message || 'Error de conexión con el servidor'
        };
      }
    }
  }
};