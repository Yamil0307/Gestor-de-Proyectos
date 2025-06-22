import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

const TeamMembersDialog = ({ 
  open, 
  onClose, 
  selectedTeam, 
  teamMembers, 
  getEmployeeById, 
  getAvailableProgrammers,
  onAddMember,
  onRemoveMember
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Miembros del Equipo: {selectedTeam?.name}</DialogTitle>
      <DialogContent>
        <Box>
          <Typography variant="h6">Miembros Actuales</Typography>
          {teamMembers.length === 0 ? (
            <Typography variant="body2" color="textSecondary">No hay miembros en este equipo</Typography>
          ) : (
            <Box>
              {teamMembers.map((member, index) => {
                const employee = getEmployeeById(member.programmer_id);
                return (
                  <Box 
                    key={`member-${member.programmer_id}-${index}`} 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center" 
                    mb={1}
                    p={1}
                    border="1px solid #eee"
                    borderRadius={1}
                  >
                    <Typography>{employee ? employee.name : `Programador ${member.programmer_id}`}</Typography>
                    <Button onClick={() => onRemoveMember(member.programmer_id)} color="error">
                      Remover
                    </Button>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
        <Box mt={2}>
          <Typography variant="h6">Programadores Disponibles</Typography>
          {getAvailableProgrammers().length === 0 ? (
            <Typography variant="body2" color="textSecondary">No hay programadores disponibles</Typography>
          ) : (
            <Box>
              {getAvailableProgrammers().map((programmer, index) => {
                const employee = getEmployeeById(programmer.employee_id);
                return (
                  <Box 
                    key={`available-${programmer.employee_id}-${index}`} 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center"
                    mb={1}
                    p={1}
                    border="1px solid #eee"
                    borderRadius={1}
                  >
                    <Typography>{employee ? employee.name : `Programador ${programmer.employee_id}`}</Typography>
                    <Button onClick={() => onAddMember(programmer.employee_id)} color="primary">
                      Agregar
                    </Button>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamMembersDialog;
