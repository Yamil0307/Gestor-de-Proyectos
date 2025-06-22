import React from 'react';
import { AppBar, Toolbar, Typography, Button, useTheme } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';

const DashboardHeader = ({ username, onLogout }) => {
  const theme = useTheme();
  
  return (
    <AppBar position="static" sx={{ borderRadius: 0, backgroundColor: theme.palette.primary.dark }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff', fontWeight: 'bold' }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mr: 2, color: '#fff' }}>
          Hola, {username}
        </Typography>
        <Button
          color="inherit"
          onClick={onLogout}
          startIcon={<LogoutIcon />}
          sx={{ borderRadius: 0 }}
        >
          Cerrar Sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
