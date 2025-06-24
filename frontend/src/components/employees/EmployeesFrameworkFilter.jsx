import React, { useState } from 'react';
import { Box, TextField, Button, Chip, CircularProgress } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';

const EmployeesFrameworkFilter = ({
  framework,
  onFrameworkChange,
  onSearch,
  onClear,
  loading,
  resultCount
}) => {
  const [input, setInput] = useState(framework);

  const handleInputChange = (e) => {
    // Solo actualizar el input local, no el filtro global
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      // Al presionar Enter actualizamos el filtro y ejecutamos la búsqueda
      onFrameworkChange(input.trim());
      onSearch(input.trim());
    }
  };

  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          name="framework"
          label="Framework de Gestión"
          variant="outlined"
          size="small"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Presione Enter para buscar"
          InputProps={{
            endAdornment: loading ? (
              <CircularProgress color="inherit" size={20} />
            ) : input ? (
              <SearchIcon fontSize="small" color="action" />
            ) : null
          }}
          sx={{ minWidth: '250px' }}
        />
        
        <Button
          variant="outlined"
          onClick={() => {
            setInput(''); // Limpiar el input local
            onClear(); // Llamar a la función de limpieza
          }}
          size="small"
          disabled={!input.trim() && !framework}
        >
          Limpiar Filtros
        </Button>
      </Box>
      
      {framework && !loading && (
        <Box sx={{ mt: 2 }}>
          <Chip
            icon={<FilterListIcon fontSize="small" />}
            label={`${resultCount} resultado${resultCount !== 1 ? 's' : ''}`}
            color="primary"
            size="small"
            variant="outlined"
          />
        </Box>
      )}
    </Box>
  );
};

export default EmployeesFrameworkFilter;