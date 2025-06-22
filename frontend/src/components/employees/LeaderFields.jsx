import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const LeaderFields = ({ formData, handleInputChange }) => {
  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Años de Experiencia:</Typography>
        <TextField
          type="number"
          name="years_experience"
          value={formData.years_experience}
          onChange={handleInputChange}
          inputProps={{ min: 0 }}
          required
          fullWidth
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Proyectos Liderados:</Typography>
        <TextField
          type="number"
          name="projects_led"
          value={formData.projects_led}
          onChange={handleInputChange}
          inputProps={{ min: 0 }}
          required
          fullWidth
        />
      </Box>
    </>
  );
};

export default LeaderFields;
