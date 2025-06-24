import React, { useState } from 'react';
import { Box, TextField, Button, Chip, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';

const EmployeesFrameworkFilter = ({
  framework,
  onFrameworkChange,
  onSearch,
  onClear,
  loading,
  resultCount,
  employeeTypeFilter,
  onEmployeeTypeFilterChange
}) => {
  const [input, setInput] = useState(framework);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      onFrameworkChange(input.trim());
      onSearch(input.trim());
    }
  };

  // Determinar si hay algún filtro activo
  const hasActiveFilters = !!input.trim() || !!framework || !!employeeTypeFilter;

  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Filtro por tipo de empleado */}
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="employee-type-filter-label">Tipo de Empleado</InputLabel>
          <Select
            labelId="employee-type-filter-label"
            value={employeeTypeFilter}
            label="Tipo de Empleado"
            onChange={e => onEmployeeTypeFilterChange(e.target.value)}
          >
            <MenuItem value="programmer">Programadores</MenuItem>
            <MenuItem value="leader">Líderes</MenuItem>
          </Select>
        </FormControl>

        {/* Filtro por framework */}
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
            setInput('');
            onClear();
          }}
          size="small"
          disabled={!hasActiveFilters}
        >
          Limpiar Filtros
        </Button>
      </Box>
      
      {/* Mostrar el contador solo si hay filtros activos y no está cargando */}
      {!loading && hasActiveFilters && (
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