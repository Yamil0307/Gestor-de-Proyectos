import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';

const TeamFormDialog = ({ 
  open, 
  onClose, 
  formData, 
  handleInputChange, 
  handleSubmit, 
  editingTeam,
  leaders,
  getEmployeeById
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editingTeam ? 'Editar Equipo' : 'Nuevo Equipo'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nombre del Equipo"
          type="text"
          fullWidth
          variant="outlined"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <Select
          margin="dense"
          label="Líder del Equipo"
          fullWidth
          variant="outlined"
          name="leader_id"
          value={formData.leader_id}
          onChange={handleInputChange}
        >
          <MenuItem value=""><em>Seleccionar líder (opcional)</em></MenuItem>
          {leaders.map((leader, index) => {
            const employee = getEmployeeById(leader.employee_id);
            return (
              <MenuItem key={`leader-${leader.employee_id}-${index}`} value={leader.employee_id}>
                {employee ? employee.name : `Líder ${leader.employee_id}`}
              </MenuItem>
            );
          })}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>{editingTeam ? 'Actualizar' : 'Guardar'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamFormDialog;
