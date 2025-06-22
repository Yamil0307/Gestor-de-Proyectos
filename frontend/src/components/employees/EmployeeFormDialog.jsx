import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Select, 
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Grid,
  Typography
} from '@mui/material';

const EmployeeFormDialog = ({ 
  open, 
  onClose, 
  formData, 
  handleInputChange, 
  handleSubmit, 
  editingEmployee,
  renderSpecificFields 
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}</DialogTitle>
      <DialogContent>
        {/* Campos básicos */}
        <Box sx={{ mb: 2, mt: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Cédula:</Typography>
          <TextField
            type="text"
            name="identity_card"
            value={formData.identity_card}
            onChange={handleInputChange}
            required
            fullWidth
            error={formData.identity_card.length > 0 && formData.identity_card.length < 5}
            helperText={formData.identity_card.length > 0 && formData.identity_card.length < 5 ? "Mínimo 5 caracteres" : ""}
            inputProps={{ minLength: 5 }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Nombre:</Typography>
          <TextField
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            fullWidth
            error={formData.name.length > 0 && formData.name.length < 3}
            helperText={formData.name.length > 0 && formData.name.length < 3 ? "Mínimo 3 caracteres" : ""}
            inputProps={{ minLength: 3 }}
          />
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Edad:</Typography>
            <TextField
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              inputProps={{ min: 18, max: 70 }}
              required
              fullWidth
              error={formData.age && parseInt(formData.age) < 18}
              helperText={formData.age && parseInt(formData.age) < 18 ? "Mínimo 18 años" : ""}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Sexo:</Typography>
            <Select
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
              required
              fullWidth
            >
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Femenino</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Salario Base:</Typography>
            <TextField
              type="number"
              name="base_salary"
              value={formData.base_salary}
              onChange={handleInputChange}
              inputProps={{ step: "0.01", min: "0" }}
              required
              fullWidth
              error={formData.base_salary && parseFloat(formData.base_salary) <= 0}
              helperText={formData.base_salary && parseFloat(formData.base_salary) <= 0 ? "El salario debe ser mayor que cero" : ""}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Tipo:</Typography>
            <Select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              disabled={editingEmployee} // No permitir cambiar tipo al editar
              fullWidth
            >
              <MenuItem value="programmer">Programador</MenuItem>
              <MenuItem value="leader">Líder</MenuItem>
            </Select>
          </Grid>
        </Grid>

        {/* Campos específicos según el tipo */}
        <Box sx={{ mt: 2 }}>
          {renderSpecificFields()}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>{editingEmployee ? 'Actualizar' : 'Guardar'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeFormDialog;
