import React, { useState, useEffect } from 'react';
import { employeeService } from '../services/employeeService';
import { programmerService } from '../services/programmerService';
import { leaderService } from '../services/leaderService';
import './Employees.css';

const Employees = ({ onBack }) => {
  const [employees, setEmployees] = useState([]);
  const [programmers, setProgrammers] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
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
      setError('Error al cargar datos');
      console.error('Error:', error);
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
    setError('');

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
        } else {
          await programmerService.createProgrammer(programmerData);
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
        } else {
          await leaderService.createLeader(leaderData);
        }
      }

      setShowForm(false);
      setEditingEmployee(null);
      resetForm();
      loadAllData();
    } catch (error) {
      setError(error.detail || error.message || 'Error al guardar empleado');
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
        loadAllData();
      } catch (error) {
        setError('Error al eliminar empleado');
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
    setError('');
  };

  // Renderizar campos específicos según el tipo
  const renderSpecificFields = () => {
    if (formData.type === 'programmer') {
      return (
        <>
          <div className="form-group">
            <label>Categoría:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="A">Categoría A</option>
              <option value="B">Categoría B</option>
              <option value="C">Categoría C</option>
            </select>
          </div>

          <div className="form-group">
            <label>Lenguajes de Programación:</label>
            {formData.languages.map((language, index) => (
              <div key={index} className="language-input">
                <input
                  type="text"
                  value={language}
                  onChange={(e) => handleLanguageChange(index, e.target.value)}
                  placeholder="Ej: Python, JavaScript, Java"
                />
                {formData.languages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLanguage(index)}
                    className="remove-language"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addLanguage}
              className="add-language"
            >
              + Agregar Lenguaje
            </button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="form-group">
            <label>Años de Experiencia:</label>
            <input
              type="number"
              name="years_experience"
              value={formData.years_experience}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Proyectos Liderados:</label>
            <input
              type="number"
              name="projects_led"
              value={formData.projects_led}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>
        </>
      );
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando empleados...</p>
      </div>
    );
  }

  return (
    <div className="employees-container">
      <div className="employees-header">
        <button onClick={onBack} className="back-button">← Volver</button>
        <h2>Gestión de Empleados</h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="add-button"
        >
          + Nuevo Empleado
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}</h3>
            
            <form onSubmit={handleSubmit} className="employee-form">
              {/* Campos básicos */}
              <div className="form-group">
                <label>Cédula:</label>
                <input
                  type="text"
                  name="identity_card"
                  value={formData.identity_card}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Edad:</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="18"
                    max="70"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Sexo:</label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Salario Base:</label>
                  <input
                    type="number"
                    name="base_salary"
                    value={formData.base_salary}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tipo:</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    disabled={editingEmployee} // No permitir cambiar tipo al editar
                  >
                    <option value="programmer">Programador</option>
                    <option value="leader">Líder</option>
                  </select>
                </div>
              </div>

              {/* Campos específicos según el tipo */}
              {renderSpecificFields()}

              <div className="form-actions">
                <button type="button" onClick={handleCancel} className="cancel-button">
                  Cancelar
                </button>
                <button type="submit" className="save-button">
                  {editingEmployee ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="employees-list">
        {employees.length === 0 ? (
          <div className="empty-state">
            <p>No hay empleados registrados</p>
          </div>
        ) : (
          <div className="employees-grid">
            {employees.map(employee => {
              const employeeDetails = getEmployeeDetails(employee);
              return (
                <div key={employee.id} className="employee-card">
                  <div className="employee-info">
                    <h4>{employee.name}</h4>
                    <p><strong>Cédula:</strong> {employee.identity_card}</p>
                    <p><strong>Edad:</strong> {employee.age} años</p>
                    <p><strong>Sexo:</strong> {employee.sex === 'M' ? 'Masculino' : 'Femenino'}</p>
                    <p><strong>Salario:</strong> ${employee.base_salary}</p>
                    <p><strong>Tipo:</strong> {employee.type === 'programmer' ? 'Programador' : 'Líder'}</p>
                    
                    {/* Mostrar campos específicos */}
                    {employee.type === 'programmer' ? (
                      <>
                        <p><strong>Categoría:</strong> {employeeDetails.category}</p>
                        <p><strong>Lenguajes:</strong> {employeeDetails.languages.join(', ') || 'Ninguno'}</p>
                      </>
                    ) : (
                      <>
                        <p><strong>Experiencia:</strong> {employeeDetails.years_experience} años</p>
                        <p><strong>Proyectos:</strong> {employeeDetails.projects_led}</p>
                      </>
                    )}
                  </div>
                  <div className="employee-actions">
                    <button 
                      onClick={() => handleEdit(employee)} 
                      className="edit-button"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(employee)} 
                      className="delete-button"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;