import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const EmployeesHeader = ({ onNewEmployee }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h5">Gestión de Empleados</Typography>
      <Button variant="contained" onClick={onNewEmployee}>+ Nuevo Empleado</Button>
    </Box>
  );
};

export default EmployeesHeader;
