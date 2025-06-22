import React from 'react';
import { Box, Typography, Select, MenuItem, TextField, Button, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const ProgrammerFields = ({ formData, handleInputChange, handleLanguageChange, addLanguage, removeLanguage }) => {
  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Categoría:</Typography>
        <Select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
          fullWidth
        >
          <MenuItem value="A">Categoría A</MenuItem>
          <MenuItem value="B">Categoría B</MenuItem>
          <MenuItem value="C">Categoría C</MenuItem>
        </Select>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Lenguajes de Programación:</Typography>
        {formData.languages.map((language, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
              type="text"
              value={language}
              onChange={(e) => handleLanguageChange(index, e.target.value)}
              placeholder="Ej: Python, JavaScript, Java"
              fullWidth
              size="small"
              sx={{ mr: 1 }}
            />
            {formData.languages.length > 1 && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => removeLanguage(index)}
                startIcon={<DeleteIcon />}
              >
                Eliminar
              </Button>
            )}
          </Box>
        ))}
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={addLanguage}
          startIcon={<AddIcon />}
          sx={{ mt: 1 }}
        >
          Agregar Lenguaje
        </Button>
      </Box>
    </>
  );
};

export default ProgrammerFields;
