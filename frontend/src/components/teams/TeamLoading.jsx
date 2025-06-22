import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const TeamLoading = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <CircularProgress />
      <Typography variant="body1" mt={2}>Cargando equipos...</Typography>
    </Box>
  );
};

export default TeamLoading;
