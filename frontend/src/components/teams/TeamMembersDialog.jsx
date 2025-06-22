import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Chip,
  Avatar
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import GroupIcon from '@mui/icons-material/Group';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';

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
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <GroupIcon color="primary" />
          <Typography variant="h6">
            Miembros del Equipo: {selectedTeam?.name}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {selectedTeam?.leader_id && (
          <Box mb={3}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <SupervisorAccountIcon sx={{ mr: 1 }} /> Líder del Equipo
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Paper elevation={2} sx={{ mb: 2, borderRadius: 1, borderLeft: '4px solid #1976d2' }}>
              <ListItem>
                <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                  <SupervisorAccountIcon />
                </Avatar>
                <ListItemText
                  primary={getEmployeeById(selectedTeam.leader_id)?.name || 'Líder no encontrado'}
                  secondary="Líder del equipo"
                />
              </ListItem>
            </Paper>
          </Box>
        )}
        
        <Box mb={3}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 1 }} /> Miembros Actuales
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {teamMembers.length === 0 ? (
            <Box p={2} textAlign="center">
              <Typography variant="body2" color="textSecondary">No hay miembros en este equipo</Typography>
            </Box>
          ) : (
            <List>
              {teamMembers.map((member, index) => {
                return (
                  <Paper 
                    key={`member-${member.programmer_id}-${index}`} 
                    elevation={1}
                    sx={{ mb: 1, borderRadius: 1 }}
                  >
                    <ListItem>
                      <Avatar sx={{ bgcolor: '#ff9800', mr: 2 }}>
                        <PersonIcon />
                      </Avatar>
                      <ListItemText
                        primary={member.employee ? member.employee.name : `Programador ${member.programmer_id}`}
                        secondary={
                          member.languages && member.languages.length > 0 ? (
                            <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                              {member.languages.map((lang, i) => (
                                <Chip key={i} label={lang} size="small" variant="outlined" />
                              ))}
                            </Box>
                          ) : 'Sin lenguajes especificados'
                        }
                      />
                      <ListItemSecondaryAction>
                        <Button 
                          onClick={() => onRemoveMember(member.programmer_id)} 
                          color="error"
                          startIcon={<PersonRemoveIcon />}
                          size="small"
                        >
                          Remover
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Paper>
                );
              })}
            </List>
          )}
        </Box>
        <Box mt={4}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonAddIcon sx={{ mr: 1 }} /> Programadores Disponibles
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {getAvailableProgrammers().length === 0 ? (
            <Box p={2} textAlign="center">
              <Typography variant="body2" color="textSecondary">No hay programadores disponibles</Typography>
            </Box>
          ) : (
            <List>
              {getAvailableProgrammers().map((programmer, index) => {
                const employee = getEmployeeById(programmer.employee_id);
                return (
                  <Paper 
                    key={`available-${programmer.employee_id}-${index}`}
                    elevation={1}
                    sx={{ mb: 1, borderRadius: 1 }}
                  >
                    <ListItem>
                      <Avatar sx={{ bgcolor: '#4caf50', mr: 2 }}>
                        <PersonIcon />
                      </Avatar>
                      <ListItemText
                        primary={employee ? employee.name : `Programador ${programmer.employee_id}`}
                        secondary={
                          programmer.languages && programmer.languages.length > 0 ? (
                            <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                              {programmer.languages.map((lang, i) => (
                                <Chip key={i} label={lang} size="small" variant="outlined" />
                              ))}
                            </Box>
                          ) : 'Sin lenguajes especificados'
                        }
                      />
                      <ListItemSecondaryAction>
                        <Button 
                          onClick={() => onAddMember(programmer.employee_id)} 
                          color="primary"
                          startIcon={<PersonAddIcon />}
                          size="small"
                        >
                          Agregar
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Paper>
                );
              })}
            </List>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamMembersDialog;
