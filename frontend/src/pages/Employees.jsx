import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material'; // Asegúrate de importar Typography
import { employeeService } from '../services/employeeService';
import { programmerService } from '../services/programmerService';
import { leaderService } from '../services/leaderService';
import { useNotification } from '../context/NotificationContext.jsx';
import { useConfirmation } from '../context/ConfirmationContext.jsx';
import { processApiError } from '../utils/errorUtils';
import EmployeeLoading from '../components/employees/EmployeeLoading';
import EmployeesList from '../components/employees/EmployeesList';
import EmployeesHeader from '../components/employees/EmployeesHeader';
import EmployeeFormDialog from '../components/employees/EmployeeFormDialog';
import ProgrammerFields from '../components/employees/ProgrammerFields';
import LeaderFields from '../components/employees/LeaderFields';
import EmployeesFrameworkFilter from '../components/employees/EmployeesFrameworkFilter';
import '../pages/Employees.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [programmers, setProgrammers] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const { showSuccess, showError, showWarning } = useNotification();
  const { showConfirmation } = useConfirmation();
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
  const [frameworkFilter, setFrameworkFilter] = useState('');
  const [frameworkResults, setFrameworkResults] = useState([]);
  const [frameworkLoading, setFrameworkLoading] = useState(false);
  // Nuevo estado para rastrear si se ha realizado una búsqueda
  const [hasFrameworkSearch, setHasFrameworkSearch] = useState(false);
  const [employeeTypeFilter, setEmployeeTypeFilter] = useState(''); // '' = todos

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
      const { message } = processApiError(error, { defaultMessage: 'Error al cargar datos de empleados' });
      showError(message);
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
      showError(error.message || 'Error al guardar empleado');
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
    const tipoPuesto = employee.type === 'programmer' ? 'programador' : 'líder';
    
    const confirmed = await showConfirmation({
      title: 'Eliminar Empleado',
      message: `¿Estás seguro de eliminar al ${tipoPuesto} "${employee.name}"? Esta acción no se puede deshacer.`,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      severity: 'error'
    });
    
    if (confirmed) {
      try {
        if (employee.type === 'programmer') {
          await programmerService.deleteProgrammer(employee.id);
        } else {
          await leaderService.deleteLeader(employee.id);
        }
        showSuccess('Empleado eliminado exitosamente');
        loadAllData();
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
        const { message } = processApiError(error, { defaultMessage: 'Error al eliminar empleado' });
        showError(message);
        
        // Si el error es por restricción de clave foránea, mostramos un mensaje más amigable
        if (message.includes('No se puede eliminar un programador asignado')) {
          showWarning('Para eliminar este empleado, primero debes removerlo de todos los equipos a los que pertenece');
        }
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

  const handleFrameworkChange = (value) => {
    setFrameworkFilter(value);
  };

  const handleFrameworkSearch = async (framework) => {
    if (!framework) return;
    
    setFrameworkLoading(true);
    setHasFrameworkSearch(true); // Indicar que se realizó una búsqueda
    
    try {
      const programmers = await programmerService.getProgrammersByFramework(framework);
      setFrameworkResults(programmers);
    } catch (error) {
      setFrameworkResults([]);
    } finally {
      setFrameworkLoading(false);
    }
  };

  const handleFrameworkClear = () => {
    setFrameworkFilter('');
    setFrameworkResults([]);
    setHasFrameworkSearch(false);
    setEmployeeTypeFilter(''); // <-- Esto limpia el filtro de tipo de empleado también
  };

  // Nueva función para obtener empleados base de los programadores filtrados
  const getFilteredEmployeesByFramework = () => {
    // frameworkResults son programadores, employees son todos los empleados
    return employees.filter(emp =>
      emp.type === 'programmer' &&
      frameworkResults.some(prog => prog.employee_id === emp.id)
    );
  };

  // Calcula los empleados filtrados por ambos filtros
  const filteredEmployees = employees.filter(emp => {
    if (!employeeTypeFilter) return true;
    return emp.type === employeeTypeFilter;
  });

  // Si hay búsqueda de framework, filtra sobre los resultados de framework
  const filteredByFrameworkAndType = hasFrameworkSearch && frameworkFilter
    ? filteredEmployees.filter(emp =>
        emp.type === 'programmer' &&
        frameworkResults.some(prog => prog.employee_id === emp.id)
      )
    : filteredEmployees;

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
      
      {/* Filtro por framework de gestión */}
      <EmployeesFrameworkFilter
        framework={frameworkFilter}
        onFrameworkChange={handleFrameworkChange}
        onSearch={handleFrameworkSearch}
        onClear={handleFrameworkClear}
        loading={frameworkLoading}
        resultCount={filteredByFrameworkAndType.length} // <-- Cambiado aquí
        employeeTypeFilter={employeeTypeFilter}
        onEmployeeTypeFilterChange={setEmployeeTypeFilter}
      />

      {/* Lógica actualizada para manejo de resultados */}
      {frameworkLoading ? (
        <EmployeeLoading />
      ) : hasFrameworkSearch && frameworkFilter ? (
        // Solo mostrar resultados filtrados o mensaje si se realizó una búsqueda
        frameworkResults.length > 0 ? (
          <EmployeesList
            employees={getFilteredEmployeesByFramework()}
            getEmployeeDetails={getEmployeeDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              No se encontraron programadores para el framework "{frameworkFilter}"
            </Typography>
          </Box>
        )
      ) : (
        // Si no hay búsqueda activa, mostrar todos los empleados
        <EmployeesList
          employees={filteredByFrameworkAndType}
          getEmployeeDetails={getEmployeeDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </Box>
  );
};

export default Employees;