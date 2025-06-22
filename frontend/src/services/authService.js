import axios from 'axios';
import { processApiError } from '../utils/errorUtils';

const API_URL = 'http://localhost:8000';

// Configurar axios para incluir el token automáticamente
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si recibimos un 401 (Unauthorized), limpiamos el token
      localStorage.removeItem('token');
      
      // Si no estamos en la página de login, redirigimos
      if (window.location.pathname !== '/login') {
        console.log('Sesión expirada. Redirigiendo a login...');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Registrar usuario
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      const formattedError = processApiError(error, { 
        defaultMessage: 'Error al registrar usuario' 
      });
      throw formattedError;
    }
  },

  // Iniciar sesión
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { access_token } = response.data;
      
      // Guardar token en localStorage
      localStorage.setItem('token', access_token);
      
      return response.data;
    } catch (error) {
      const formattedError = processApiError(error, { 
        defaultMessage: 'Error al iniciar sesión' 
      });
      throw formattedError;
    }
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem('token');
  },

  // Obtener información del usuario actual
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      const formattedError = processApiError(error, { 
        defaultMessage: 'Error al obtener información del usuario' 
      });
      throw formattedError;
    }
  },

  // Verificar si hay token guardado
  getToken() {
    return localStorage.getItem('token');
  },

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }
};

export default api;