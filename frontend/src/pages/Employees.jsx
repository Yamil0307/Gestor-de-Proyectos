import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { employeeService } from '../services/employeeService';
import { programmerService } from '../services/programmerService';
import { leaderService } from '../services/leaderService';
import { useNotification } from '../context/NotificationContext.jsx';
import EmployeeLoading from '../components/employees/EmployeeLoading';
import EmployeesList from '../components/employees/EmployeesList';
import EmployeesHeader from '../components/employees/EmployeesHeader';
import EmployeeFormDialog from '../components/employees/EmployeeFormDialog';
import ProgrammerFields from '../components/employees/ProgrammerFields';
import LeaderFields from '../components/employees/LeaderFields';
import './Employees.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [programmers, setProgrammers] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const { showSuccess, showError, showWarning } = useNotification();
  const [formData, setFormData] = useState({
    identity_card: '',
    name: '',
    age: '',
    sex: 'M',
    base_salary: '',
    type: 'programmer',
    // Campos específicos para programadores
    category: 'A',
    languages: [''],
    // Campos específicos para líderes
    years_experience: '',
    projects_led: ''
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [employeesData, programmersData, leadersData] = await Promise.all([
        employeeService.getEmployees(),
        programmerService.getProgrammers(),
        leaderService.getLeaders()
      ]);
      
      setEmployees(employeesData);
      setProgrammers(programmersData);
      setLeaders(leadersData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      let errorMessage = 'Error al cargar datos';
      
      if (error.response?.data?.detail) {
        // Si es un array, toma el primer mensaje
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail[0]?.msg || errorMessage;
        } else {
          errorMessage = error.response.data.detail;
        }
      } else if (typeof error.detail === 'string') {
        errorMessage = error.detail;
      } else if (typeof error.message === 'string') {
        errorMessage = error.message;
      }
      
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Combinar datos de empleados con sus detalles específicos
  const getEmployeeDetails = (employee) => {
    if (employee.type === 'programmer') {
      const programmerDetails = programmers.find(p => p.employee_id === employee.id);
      return {
        ...employee,
        category: programmerDetails?.category || 'N/A',
        languages: programmerDetails?.languages || []
      };
    } else {
      const leaderDetails = leaders.find(l => l.employee_id === employee.id);
      return {
        ...employee,
        years_experience: leaderDetails?.years_experience || 0,
        projects_led: leaderDetails?.projects_led || 0
      };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageChange = (index, value) => {
    const newLanguages = [...formData.languages];
    newLanguages[index] = value;
    setFormData(prev => ({
      ...prev,
      languages: newLanguages
    }));
  };

  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, '']
    }));
  };

  const removeLanguage = (index) => {
    const newLanguages = formData.languages.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      languages: newLanguages.length > 0 ? newLanguages : ['']
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica del formulario
    if (formData.identity_card.length < 5) {
      showError("La cédula debe tener al menos 5 caracteres");
      return;
    }

    if (formData.name.length < 3) {
      showError("El nombre debe tener al menos 3 caracteres");
      return;
    }

    if (!formData.age || parseInt(formData.age) < 18) {
      showError("La edad debe ser de al menos 18 años");
      return;
    }

    if (!formData.base_salary || parseFloat(formData.base_salary) <= 0) {
      showError("El salario base debe ser mayor que cero");
      return;
    }

    // Validaciones específicas según el tipo
    if (formData.type === 'leader') {
      if (!formData.years_experience) {
        showError("Los años de experiencia son obligatorios para líderes");
        return;
      }
      if (!formData.projects_led) {
        showError("Los proyectos liderados son obligatorios para líderes");
        return;
      }
    } else if (formData.type === 'programmer') {
      if (!formData.languages || formData.languages.length === 0 || !formData.languages[0]) {
        showError("Debe ingresar al menos un lenguaje de programación");
        return;
      }
    }

    try {
      if (formData.type === 'programmer') {
        const programmerData = {
          employee_data: {
            identity_card: formData.identity_card,
            name: formData.name,
            age: parseInt(formData.age),
            sex: formData.sex,
            base_salary: parseFloat(formData.base_salary),
            type: 'programmer'
          },
          category: formData.category,
          languages: formData.languages.filter(lang => lang.trim() !== '')
        };

        if (editingEmployee) {
          // Actualizar empleado básico primero
          await employeeService.updateEmployee(editingEmployee.id, programmerData.employee_data);
          // Actualizar datos específicos del programador
          await programmerService.updateProgrammer(editingEmployee.id, {
            category: formData.category,
            languages: formData.languages.filter(lang => lang.trim() !== '')
          });
          showSuccess('Programador actualizado exitosamente');
        } else {
          await programmerService.createProgrammer(programmerData);
          showSuccess('Programador creado exitosamente');
        }
      } else {
        const leaderData = {
          employee_data: {
            identity_card: formData.identity_card,
            name: formData.name,
            age: parseInt(formData.age),
            sex: formData.sex,
            base_salary: parseFloat(formData.base_salary),
            type: 'leader'
          },
          years_experience: parseInt(formData.years_experience),
          projects_led: parseInt(formData.projects_led)
        };

        if (editingEmployee) {
          // Actualizar empleado básico primero
          await employeeService.updateEmployee(editingEmployee.id, leaderData.employee_data);
          // Actualizar datos específicos del líder
          await leaderService.updateLeader(editingEmployee.id, {
            years_experience: parseInt(formData.years_experience),
            projects_led: parseInt(formData.projects_led)
          });
          showSuccess('Líder actualizado exitosamente');
        } else {
          await leaderService.createLeader(leaderData);
          showSuccess('Líder creado exitosamente');
        }
      }

      setShowForm(false);
      setEditingEmployee(null);
      resetForm();
      loadAllData();
    } catch (error) {
      console.error('Error al guardar empleado:', error);
      let errorMessage = 'Error al guardar empleado';
      
      if (error.response?.data?.detail) {
        // Si es un array, toma el primer mensaje
        if (Array.isArray(error.response.data.detail)) {
          const errorDetail = error.response.data.detail[0];
          // Formatear mensaje para campos específicos
          if (errorDetail?.loc?.includes('identity_card')) {
            errorMessage = `Error en Cédula: ${errorDetail.msg}`;
          } else if (errorDetail?.loc?.includes('name')) {
            errorMessage = `Error en Nombre: ${errorDetail.msg}`;
          } else if (errorDetail?.loc?.includes('age')) {
            errorMessage = `Error en Edad: ${errorDetail.msg}`;
          } else if (errorDetail?.loc?.includes('base_salary')) {
            errorMessage = `Error en Salario: ${errorDetail.msg}`;
          } else if (errorDetail?.msg) {
            errorMessage = errorDetail.msg;
          }
        } else {
          errorMessage = error.response.data.detail;
        }
      } else if (typeof error.detail === 'string') {
        errorMessage = error.detail;
      } else if (typeof error.message === 'string') {
        errorMessage = error.message;
      }
      
      showError(errorMessage);
    }
  };

  const handleEdit = (employee) => {
    const employeeDetails = getEmployeeDetails(employee);
    setEditingEmployee(employee);
    
    setFormData({
      identity_card: employee.identity_card,
      name: employee.name,
      age: employee.age.toString(),
      sex: employee.sex,
      base_salary: employee.base_salary.toString(),
      type: employee.type,
      // Campos específicos según el tipo
      category: employeeDetails.category || 'A',
      languages: employeeDetails.languages || [''],
      years_experience: employeeDetails.years_experience?.toString() || '',
      projects_led: employeeDetails.projects_led?.toString() || ''
    });
    
    setShowForm(true);
  };

  const handleDelete = async (employee) => {
    if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
      try {
        if (employee.type === 'programmer') {
          await programmerService.deleteProgrammer(employee.id);
        } else {
          await leaderService.deleteLeader(employee.id);
        }
        showSuccess('Empleado eliminado exitosamente');
        loadAllData();    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      let errorMessage = 'Error al eliminar empleado';
      
      if (error.response?.data?.detail) {
        // Si es un array, toma el primer mensaje
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail[0]?.msg || errorMessage;
        } else {
          errorMessage = error.response.data.detail;
        }
      } else if (typeof error.detail === 'string') {
        errorMessage = error.detail;
      } else if (typeof error.message === 'string') {
        errorMessage = error.message;
      }
      
      showError(errorMessage);
    }
    }
  };

  const resetForm = () => {
    setFormData({
      identity_card: '',
      name: '',
      age: '',
      sex: 'M',
      base_salary: '',
      type: 'programmer',
      category: 'A',
      languages: [''],
      years_experience: '',
      projects_led: ''
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEmployee(null);
    resetForm();
  };

  // Renderizar campos específicos según el tipo
  const renderSpecificFields = () => {
    if (formData.type === 'programmer') {
      return (
        <ProgrammerFields 
          formData={formData} 
          handleInputChange={handleInputChange}
          handleLanguageChange={handleLanguageChange}
          addLanguage={addLanguage}
          removeLanguage={removeLanguage}
        />
      );
    } else {
      return (
        <LeaderFields 
          formData={formData} 
          handleInputChange={handleInputChange}
        />
      );
    }
  };

  if (loading) {
    return <EmployeeLoading />;
  }

  return (
    <Box p={3}>
      <EmployeesHeader onNewEmployee={() => setShowForm(true)} />
      
      <EmployeeFormDialog 
        open={showForm}
        onClose={handleCancel}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        editingEmployee={editingEmployee}
        renderSpecificFields={renderSpecificFields}
      />
      
      <EmployeesList 
        employees={employees}
        getEmployeeDetails={getEmployeeDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default Employees;