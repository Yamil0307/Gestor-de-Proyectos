import React from 'react';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';

/**
 * Componente de carga reutilizable con diferentes variantes
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.message - Mensaje a mostrar durante la carga
 * @param {string} props.variant - Variante del componente (default, overlay, inline)
 * @param {string} props.size - Tamaño del indicador de carga (small, medium, large)
 * @param {Object} props.sx - Estilos adicionales para el componente
 */
const LoadingIndicator = ({ 
  message = "Cargando...", 
  variant = "default",
  size = "medium",
  sx = {}
}) => {
  // Tamaños del indicador
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60
  };
  
  // Variante overlay (cubre toda la pantalla con fondo semitransparente)
  if (variant === "overlay") {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 9999,
          ...sx
        }}
      >
        <Paper 
          elevation={3}
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2
          }}
        >
          <CircularProgress size={sizeMap[size]} />
          <Typography variant="h6" mt={2}>{message}</Typography>
        </Paper>
      </Box>
    );
  }
  
  // Variante inline (más pequeña, para cargas dentro de componentes)
  if (variant === "inline") {
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        sx={sx}
      >
        <CircularProgress size={sizeMap.small} />
        <Typography variant="body2" ml={1}>{message}</Typography>
      </Box>
    );
  }
  
  // Variante default (centrada en su contenedor)
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      p={4}
      sx={sx}
    >
      <CircularProgress size={sizeMap[size]} />
      <Typography variant="h6" mt={2}>{message}</Typography>
    </Box>
  );
};

export default LoadingIndicator;
