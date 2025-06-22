import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const TeamsHeader = ({ onNewTeam }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h5">Gestión de Equipos</Typography>
      <Button variant="contained" onClick={onNewTeam}>+ Nuevo Equipo</Button>
    </Box>
  );
};

export default TeamsHeader;
