import api from './authService';
import { processApiError } from '../utils/errorUtils';

export const employeeService = {
  // Obtener todos los empleados
  async getEmployees(skip = 0, limit = 100) {
    try {
      const response = await api.get(`/employees/?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      const formattedError = processApiError(error, { 
        defaultMessage: 'Error al obtener la lista de empleados' 
      });
      throw formattedError;
    }
  },

  // Obtener empleado por ID
  async getEmployee(id) {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      const formattedError = processApiError(error, { 
        defaultMessage: `Error al obtener el empleado con ID ${id}` 
      });
      throw formattedError;
    }
  },

  // Crear nuevo empleado
  async createEmployee(employeeData) {
    try {
      const response = await api.post('/employees/', employeeData);
      return response.data;
    } catch (error) {
      const formattedError = processApiError(error, { 
        defaultMessage: 'Error al crear el empleado' 
      });
      throw formattedError;
    }
  },

  // Actualizar empleado
  async updateEmployee(id, employeeData) {
    try {
      const response = await api.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      const formattedError = processApiError(error, { 
        defaultMessage: `Error al actualizar el empleado con ID ${id}` 
      });
      throw formattedError;
    }
  },

  // Eliminar empleado
  async deleteEmployee(id) {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      const formattedError = processApiError(error, { 
        defaultMessage: `Error al eliminar el empleado con ID ${id}` 
      });
      throw formattedError;
    }
  },

  // Calcular salario del empleado
  async getEmployeeSalary(id) {
    try {
      const response = await api.get(`/employees/${id}/salary`);
      return response.data;
    } catch (error) {
      const formattedError = processApiError(error, { 
        defaultMessage: `Error al calcular el salario del empleado con ID ${id}` 
      });
      throw formattedError;
    }
  }
};