import React, { useState, useEffect } from 'react';
import { teamService } from '../services/teamService';
import { leaderService } from '../services/leaderService';
import { programmerService } from '../services/programmerService';
import { employeeService } from '../services/employeeService';
import './Teams.css';

const Teams = ({ onBack }) => {
  const [teams, setTeams] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [programmers, setProgrammers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    leader_id: ''
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [teamsData, leadersData, programmersData, employeesData] = await Promise.all([
        teamService.getTeams(),
        leaderService.getLeaders(),
        programmerService.getProgrammers(),
        employeeService.getEmployees()
      ]);
      
      setTeams(teamsData);
      setLeaders(leadersData);
      setProgrammers(programmersData);
      setEmployees(employeesData);
    } catch (error) {
      setError('Error al cargar datos');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener información del empleado por ID
  const getEmployeeById = (employeeId) => {
    return employees.find(emp => emp.id === employeeId);
  };

  // Obtener información del líder por employee_id
  const getLeaderByEmployeeId = (employeeId) => {
    return leaders.find(leader => leader.employee_id === employeeId);
  };

  // Obtener nombre del líder del equipo
  const getTeamLeaderName = (team) => {
    if (!team.leader_id) return 'Sin líder';
    const leader = leaders.find(l => l.employee_id === team.leader_id);
    if (leader) {
      const employee = getEmployeeById(leader.employee_id);
      return employee ? employee.name : 'Líder no encontrado';
    }
    return 'Líder no encontrado';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const teamData = {
        name: formData.name,
        leader_id: formData.leader_id ? parseInt(formData.leader_id) : null
      };

      if (editingTeam) {
        await teamService.updateTeam(editingTeam.id, teamData);
      } else {
        await teamService.createTeam(teamData);
      }

      setShowForm(false);
      setEditingTeam(null);
      resetForm();
      loadAllData();
    } catch (error) {
      setError(error.detail || error.message || 'Error al guardar equipo');
    }
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      leader_id: team.leader_id?.toString() || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (team) => {
    if (window.confirm('¿Estás seguro de eliminar este equipo?')) {
      try {
        await teamService.deleteTeam(team.id);
        loadAllData();
      } catch (error) {
        setError('Error al eliminar equipo');
      }
    }
  };

  const handleViewMembers = async (team) => {
    try {
      setSelectedTeam(team);
      const members = await teamService.getTeamMembers(team.id);
      setTeamMembers(members);
      setShowMembersModal(true);
    } catch (error) {
      setError('Error al cargar miembros del equipo');
    }
  };

  const handleAddMember = async (programmerId) => {
    try {
      await teamService.addTeamMember(selectedTeam.id, programmerId);
      const updatedMembers = await teamService.getTeamMembers(selectedTeam.id);
      setTeamMembers(updatedMembers);
    } catch (error) {
      setError('Error al agregar miembro al equipo');
    }
  };

  const handleRemoveMember = async (programmerId) => {
    try {
      await teamService.removeTeamMember(selectedTeam.id, programmerId);
      const updatedMembers = await teamService.getTeamMembers(selectedTeam.id);
      setTeamMembers(updatedMembers);
    } catch (error) {
      setError('Error al remover miembro del equipo');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      leader_id: ''
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTeam(null);
    resetForm();
    setError('');
  };

  // Obtener programadores disponibles (no asignados al equipo actual)
  const getAvailableProgrammers = () => {
    if (!selectedTeam) return [];
    const memberIds = teamMembers.map(member => member.programmer_id);
    return programmers.filter(programmer => !memberIds.includes(programmer.employee_id));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando equipos...</p>
      </div>
    );
  }

  return (
    <div className="teams-container">
      <div className="teams-header">
        <button onClick={onBack} className="back-button">← Volver</button>
        <h2>Gestión de Equipos</h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="add-button"
        >
          + Nuevo Equipo
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Modal de formulario */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingTeam ? 'Editar Equipo' : 'Nuevo Equipo'}</h3>
            
            <form onSubmit={handleSubmit} className="team-form">
              <div className="form-group">
                <label>Nombre del Equipo:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Equipo Frontend, Equipo Backend"
                />
              </div>

              <div className="form-group">
                <label>Líder del Equipo:</label>
                <select
                  name="leader_id"
                  value={formData.leader_id}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar líder (opcional)</option>
                  {leaders.map(leader => {
                    const employee = getEmployeeById(leader.employee_id);
                    return (
                      <option key={leader.employee_id} value={leader.employee_id}>
                        {employee ? employee.name : `Líder ${leader.employee_id}`}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCancel} className="cancel-button">
                  Cancelar
                </button>
                <button type="submit" className="save-button">
                  {editingTeam ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de miembros */}
      {showMembersModal && selectedTeam && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <h3>Miembros del Equipo: {selectedTeam.name}</h3>
            
            <div className="members-section">
              <h4>Miembros Actuales</h4>
              {teamMembers.length === 0 ? (
                <p className="no-members">No hay miembros en este equipo</p>
              ) : (
                <div className="members-list">
                  {teamMembers.map(member => {
                    const employee = getEmployeeById(member.programmer_id);
                    return (
                      <div key={member.programmer_id} className="member-item">
                        <span>{employee ? employee.name : `Programador ${member.programmer_id}`}</span>
                        <button
                          onClick={() => handleRemoveMember(member.programmer_id)}
                          className="remove-member-button"
                        >
                          Remover
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="available-section">
              <h4>Programadores Disponibles</h4>
              {getAvailableProgrammers().length === 0 ? (
                <p className="no-available">No hay programadores disponibles</p>
              ) : (
                <div className="available-list">
                  {getAvailableProgrammers().map(programmer => {
                    const employee = getEmployeeById(programmer.employee_id);
                    return (
                      <div key={programmer.employee_id} className="available-item">
                        <span>{employee ? employee.name : `Programador ${programmer.employee_id}`}</span>
                        <button
                          onClick={() => handleAddMember(programmer.employee_id)}
                          className="add-member-button"
                        >
                          Agregar
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button 
                onClick={() => setShowMembersModal(false)} 
                className="close-button"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de equipos */}
      <div className="teams-list">
        {teams.length === 0 ? (
          <div className="empty-state">
            <p>No hay equipos registrados</p>
          </div>
        ) : (
          <div className="teams-grid">
            {teams.map(team => (
              <div key={team.id} className="team-card">
                <div className="team-info">
                  <h4>{team.name}</h4>
                  <p><strong>Líder:</strong> {getTeamLeaderName(team)}</p>
                  <p><strong>ID:</strong> {team.id}</p>
                </div>
                <div className="team-actions">
                  <button 
                    onClick={() => handleViewMembers(team)} 
                    className="members-button"
                  >
                    Ver Miembros
                  </button>
                  <button 
                    onClick={() => handleEdit(team)} 
                    className="edit-button"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(team)} 
                    className="delete-button"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;