import React from 'react';
import { Box, TextField, MenuItem, FormControl, InputLabel, Select, Button, Chip, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const ProjectFilters = ({ filters, onFilterChange, onClearFilters, resultCount }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  // Determinar si hay filtros activos
  const hasActiveFilters = filters.type || filters.search;

  return (
    <Box sx={{ 
      mb: 3, 
      p: 2, 
      bgcolor: '#f5f5f5', 
      borderRadius: 1,
      position: 'relative'
    }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="type-filter-label">Tipo de Proyecto</InputLabel>
          <Select
            labelId="type-filter-label"
            name="type"
            value={filters.type || ''}
            label="Tipo de Proyecto"
            onChange={handleChange}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="management">Gestión</MenuItem>
            <MenuItem value="multimedia">Multimedia</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          name="search"
          label="Buscar por nombre"
          variant="outlined"
          size="small"
          value={filters.search || ''}
          onChange={handleChange}
        />
        
        <Button 
          variant="outlined" 
          onClick={onClearFilters}
          size="small"
          disabled={!hasActiveFilters}
        >
          Limpiar Filtros
        </Button>
      </Box>

      {/* Contador de resultados */}
      {hasActiveFilters && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 16,
            display: 'flex',
            alignItems: 'center',
          }}
        >
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

export default ProjectFilters;