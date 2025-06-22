import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { teamService } from '../services/teamService';
import { leaderService } from '../services/leaderService';
import { programmerService } from '../services/programmerService';
import { employeeService } from '../services/employeeService';
import { useNotification } from '../context/NotificationContext.jsx';
import { useConfirmation } from '../context/ConfirmationContext.jsx';
import { processApiError } from '../utils/errorUtils';
import TeamLoading from '../components/teams/TeamLoading';
import TeamsList from '../components/teams/TeamsList';
import TeamsHeader from '../components/teams/TeamsHeader';
import TeamFormDialog from '../components/teams/TeamFormDialog';
import TeamMembersDialog from '../components/teams/TeamMembersDialog';

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
  const { showConfirmation } = useConfirmation();
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
      const { message } = processApiError(error, { defaultMessage: 'Error al cargar datos' });
      showError(message);
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
      const { message } = processApiError(error, { defaultMessage: 'Error al guardar equipo' });
      showError(message);
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
    const confirmed = await showConfirmation({
      title: 'Eliminar Equipo',
      message: `¿Estás seguro de eliminar el equipo "${team.name}"? Esta acción no se puede deshacer.`,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      severity: 'error'
    });
    
    if (confirmed) {
      try {
        await teamService.deleteTeam(team.id);
        showSuccess('Equipo eliminado exitosamente');
        loadAllData();
      } catch (error) {
        console.error('Error al eliminar equipo:', error);
        const { message } = processApiError(error, { defaultMessage: 'Error al eliminar equipo' });
        showError(message);
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
      const { message } = processApiError(error, { defaultMessage: 'Error al cargar miembros del equipo' });
      showError(message);
    }
  };

  const handleAddMember = async (programmerId) => {
    // Buscar el nombre del programador
    const programmer = programmers.find(p => p.employee_id === programmerId);
    const employee = getEmployeeById(programmerId);
    const programmerName = employee?.name || `Programador ${programmerId}`;
    
    const confirmed = await showConfirmation({
      title: 'Agregar Miembro',
      message: `¿Estás seguro de agregar a "${programmerName}" al equipo "${selectedTeam.name}"?`,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      severity: 'info'
    });
    
    if (confirmed) {
      try {
        await teamService.addTeamMember(selectedTeam.id, programmerId);
        const updatedMembers = await teamService.getTeamMembers(selectedTeam.id);
        setTeamMembers(updatedMembers);
        showSuccess('Miembro agregado al equipo exitosamente');
      } catch (error) {
        console.error('Error al agregar miembro al equipo:', error);
        const { message } = processApiError(error, { defaultMessage: 'Error al agregar miembro al equipo' });
        showError(message);
      }
    }
  };

  const handleRemoveMember = async (programmerId) => {
    // Buscar el nombre del programador
    const member = teamMembers.find(m => m.programmer_id === programmerId);
    const programmerName = member?.employee?.name || `Programador ${programmerId}`;
    
    const confirmed = await showConfirmation({
      title: 'Remover Miembro',
      message: `¿Estás seguro de remover a "${programmerName}" del equipo "${selectedTeam.name}"?`,
      confirmButtonText: 'Remover',
      cancelButtonText: 'Cancelar',
      severity: 'warning'
    });
    
    if (confirmed) {
      try {
        await teamService.removeTeamMember(selectedTeam.id, programmerId);
        const updatedMembers = await teamService.getTeamMembers(selectedTeam.id);
        setTeamMembers(updatedMembers);
        showSuccess('Miembro removido del equipo exitosamente');
      } catch (error) {
        console.error('Error al remover miembro del equipo:', error);
        const { message } = processApiError(error, { defaultMessage: 'Error al remover miembro del equipo' });
        showError(message);
      }
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
    // Extraer los IDs de los programadores que ya están en el equipo
    const memberIds = teamMembers.map(member => member.programmer_id);
    // Filtrar los programadores que no están en el equipo
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