import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { teamService } from '../services/teamService';
import { leaderService } from '../services/leaderService';
import { programmerService } from '../services/programmerService';
import { employeeService } from '../services/employeeService';
import { useNotification } from '../context/NotificationContext.jsx';
import TeamLoading from '../components/teams/TeamLoading';
import TeamsList from '../components/teams/TeamsList';
import TeamsHeader from '../components/teams/TeamsHeader';
import TeamFormDialog from '../components/teams/TeamFormDialog';
import TeamMembersDialog from '../components/teams/TeamMembersDialog';
import './Teams.css';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [programmers, setProgrammers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);
  const { showSuccess, showError, showWarning } = useNotification();
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

    try {
      const teamData = {
        name: formData.name,
        leader_id: formData.leader_id ? parseInt(formData.leader_id) : null
      };

      if (editingTeam) {
        await teamService.updateTeam(editingTeam.id, teamData);
        showSuccess('Equipo actualizado exitosamente');
      } else {
        await teamService.createTeam(teamData);
        showSuccess('Equipo creado exitosamente');
      }

      setShowForm(false);
      setEditingTeam(null);
      resetForm();
      loadAllData();
    } catch (error) {
      console.error('Error al guardar equipo:', error);
      let errorMessage = 'Error al guardar equipo';
      
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
        showSuccess('Equipo eliminado exitosamente');
        loadAllData();    } catch (error) {
      console.error('Error al eliminar equipo:', error);
      let errorMessage = 'Error al eliminar equipo';
      
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

  const handleViewMembers = async (team) => {
    try {
      setSelectedTeam(team);
      const members = await teamService.getTeamMembers(team.id);
      setTeamMembers(members);
      setShowMembersModal(true);
    } catch (error) {
      console.error('Error al cargar miembros del equipo:', error);
      let errorMessage = 'Error al cargar miembros del equipo';
      
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
  };

  const handleAddMember = async (programmerId) => {
    try {
      await teamService.addTeamMember(selectedTeam.id, programmerId);
      const updatedMembers = await teamService.getTeamMembers(selectedTeam.id);
      setTeamMembers(updatedMembers);
      showSuccess('Miembro agregado al equipo exitosamente');
    } catch (error) {
      console.error('Error al agregar miembro al equipo:', error);
      let errorMessage = 'Error al agregar miembro al equipo';
      
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
  };

  const handleRemoveMember = async (programmerId) => {
    try {
      await teamService.removeTeamMember(selectedTeam.id, programmerId);
      const updatedMembers = await teamService.getTeamMembers(selectedTeam.id);
      setTeamMembers(updatedMembers);
      showSuccess('Miembro removido del equipo exitosamente');
    } catch (error) {
      console.error('Error al remover miembro del equipo:', error);
      let errorMessage = 'Error al remover miembro del equipo';
      
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
  };

  // Obtener programadores disponibles (no asignados al equipo actual)
  const getAvailableProgrammers = () => {
    if (!selectedTeam) return [];
    const memberIds = teamMembers.map(member => member.programmer_id);
    return programmers.filter(programmer => !memberIds.includes(programmer.employee_id));
  };

  if (loading) {
    return <TeamLoading />;
  }

  return (
    <Box p={3}>
      <TeamsHeader onNewTeam={() => setShowForm(true)} />
      
      <TeamFormDialog 
        open={showForm}
        onClose={handleCancel}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        editingTeam={editingTeam}
        leaders={leaders}
        getEmployeeById={getEmployeeById}
      />
      
      <TeamMembersDialog 
        open={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        selectedTeam={selectedTeam}
        teamMembers={teamMembers}
        getEmployeeById={getEmployeeById}
        getAvailableProgrammers={getAvailableProgrammers}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />
      
      <TeamsList 
        teams={teams}
        getTeamLeaderName={getTeamLeaderName}
        onViewMembers={handleViewMembers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default Teams;