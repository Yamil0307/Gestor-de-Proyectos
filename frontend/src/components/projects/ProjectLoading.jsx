import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProjectLoading = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Cargando proyectos...
      </Typography>
    </Box>
  );
};

export default ProjectLoading;