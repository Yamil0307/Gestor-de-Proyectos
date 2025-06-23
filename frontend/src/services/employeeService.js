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

  // Obtener los empleados mejor pagados
  async getHighestPaidEmployees() {
    try {
      const response = await api.get('/analytics/highest-paid-employees');
      console.log('Datos de empleados mejor pagados:', response.data); // Para depuración
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener empleados mejor pagados:', error);
      // Intentar con un enfoque alternativo si el endpoint principal falla
      try {
        const employees = await this.getEmployees();
        if (!Array.isArray(employees) || employees.length === 0) return [];
        
        const employeesWithSalary = await Promise.all(employees.map(async (emp) => {
          try {
            const salaryData = await this.getEmployeeSalary(emp.id);
            const salary = typeof salaryData === 'number' ? salaryData : 
                          (salaryData && salaryData.salary ? salaryData.salary : 0);
            
            return {
              employee_id: emp.id,
              name: emp.name,
              total_salary: salary
            };
          } catch (e) {
            return null;
          }
        }));
        
        // Filtrar nulos y ordenar por salario descendente
        return employeesWithSalary
          .filter(emp => emp !== null)
          .sort((a, b) => b.total_salary - a.total_salary)
          .slice(0, 5); // Limitar a 5 empleados, como haría el endpoint original
      } catch (alternativeError) {
        console.error('Error en enfoque alternativo:', alternativeError);
        return [];
      }
    }
  },

  // Obtener el salario de un empleado específico
  async getEmployeeSalary(employeeId) {
    try {
      const response = await api.get(`/employees/${employeeId}/salary`);
      return response.data;
    } catch (error) {
      throw processApiError(error, { defaultMessage: 'Error al obtener salario del empleado' });
    }
  },

  // Calcular el total de la nómina mensual - versión corregida
  async getTotalMonthlySalary() {
    try {
      // Si existe un endpoint específico, usarlo primero
      try {
        const response = await api.get('/analytics/total-salary');
        if (response.data && typeof response.data.total === 'number') {
          return response.data.total;
        } else if (typeof response.data === 'number') {
          return response.data; // Por si el endpoint devuelve directamente el número
        }
      } catch (specificError) {
        // Si falla, continuamos con el método alternativo
        console.log('Endpoint específico no disponible, usando método alternativo');
      }
      
      // Método alternativo: Sumar salarios de los empleados mejor pagados
      const highestPaidEmployees = await this.getHighestPaidEmployees();
      
      if (Array.isArray(highestPaidEmployees) && highestPaidEmployees.length > 0) {
        let totalSalary = 0;
        for (const employee of highestPaidEmployees) {
          // Verificar si hay total_salary (formato del backend) o salary (posible formato alternativo)
          if (employee) {
            const salaryValue = employee.total_salary || employee.salary || 0;
            totalSalary += parseFloat(salaryValue) || 0;
          }
        }
        return totalSalary;
      }
      
      // Si también falla, intentar con todos los empleados
      const employees = await this.getEmployees();
      if (!Array.isArray(employees)) return 0;
      
      let salarySum = 0;
      for (const employee of employees) {
        try {
          const salaryData = await this.getEmployeeSalary(employee.id);
          // El backend podría devolver directamente un número o un objeto con propiedad
          const salary = typeof salaryData === 'number' ? salaryData : 
                        (salaryData && typeof salaryData.salary === 'number' ? salaryData.salary : 0);
          salarySum += parseFloat(salary) || 0;
        } catch (e) {
          console.log(`Error obteniendo salario para empleado ${employee.id}:`, e);
        }
      }
      
      return salarySum;
    } catch (error) {
      console.error('Error al calcular la nómina total:', error);
      return 0; // Devolver 0 en caso de error
    }
  }
};