import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const ProjectHeader = ({ onNewProject }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
    <Typography variant="h5" fontWeight="bold">
      Proyectos
    </Typography>
    <Button variant="contained" color="primary" onClick={onNewProject}>
      Nuevo Proyecto
    </Button>
  </Box>
);

export default ProjectHeader;