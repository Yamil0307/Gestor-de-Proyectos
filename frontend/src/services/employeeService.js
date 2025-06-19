import api from './authService';

export const employeeService = {
  // Obtener todos los empleados
  async getEmployees(skip = 0, limit = 100) {
    try {
      const response = await api.get(`/employees/?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Obtener empleado por ID
  async getEmployee(id) {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Crear nuevo empleado
  async createEmployee(employeeData) {
    try {
      const response = await api.post('/employees/', employeeData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Actualizar empleado
  async updateEmployee(id, employeeData) {
    try {
      const response = await api.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Eliminar empleado
  async deleteEmployee(id) {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Calcular salario del empleado
  async getEmployeeSalary(id) {
    try {
      const response = await api.get(`/employees/${id}/salary`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};