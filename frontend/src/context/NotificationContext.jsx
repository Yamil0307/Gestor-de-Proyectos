import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', 'info'
    autoHideDuration: 6000,
  });

  const showNotification = useCallback((message, severity = 'info', autoHideDuration = 6000) => {
    setNotification({
      open: true,
      message,
      severity,
      autoHideDuration,
    });
  }, []);

  const showSuccess = useCallback((message, autoHideDuration = 4000) => {
    showNotification(message, 'success', autoHideDuration);
  }, [showNotification]);

  const showError = useCallback((message, autoHideDuration = 8000) => {
    showNotification(message, 'error', autoHideDuration);
  }, [showNotification]);

  const showWarning = useCallback((message, autoHideDuration = 6000) => {
    showNotification(message, 'warning', autoHideDuration);
  }, [showNotification]);

  const showInfo = useCallback((message, autoHideDuration = 5000) => {
    showNotification(message, 'info', autoHideDuration);
  }, [showNotification]);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    hideNotification();
  };

  const value = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={notification.autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 8 }} // Margen superior para que no tape la barra de navegación
      >
        <Alert 
          onClose={handleClose} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
