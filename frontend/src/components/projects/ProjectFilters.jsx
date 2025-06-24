import React from 'react';
import { Box, TextField, MenuItem, FormControl, InputLabel, Select, Button, Chip, Typography, CircularProgress } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';

const ProjectFilters = ({ filters, onFilterChange, onClearFilters, resultCount, loading = false, onSearchByIdentity }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };
  
  // Manejador para la tecla Enter en el campo de carnet
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filters.identityCard) {
      e.preventDefault();
      onSearchByIdentity(filters.identityCard);
    }
  };

  // Determinar si hay filtros activos
  const hasActiveFilters = filters.type || filters.search || filters.identityCard;

  return (
    <Box sx={{ 
      mb: 3, 
      p: 2, 
      bgcolor: '#f5f5f5', 
      borderRadius: 1
    }}>
      {/* Fila de controles de filtro */}
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
        
        {/* Campo de carnet con indicador de carga y manejo de Enter */}
        <Box sx={{ position: 'relative' }}>
          <TextField
            name="identityCard"
            label="Carnet de programador"
            variant="outlined"
            size="small"
            type="text"
            value={filters.identityCard || ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Presione Enter para buscar"
            InputProps={{
              endAdornment: loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : filters.identityCard ? (
                <SearchIcon fontSize="small" color="action" />
              ) : null
            }}
          />
        </Box>
        
        <Button 
          variant="outlined" 
          onClick={onClearFilters}
          size="small"
          disabled={!hasActiveFilters}
        >
          Limpiar Filtros
        </Button>
      </Box>

      {/* Contador de resultados en nueva fila */}
      {hasActiveFilters && !loading && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
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