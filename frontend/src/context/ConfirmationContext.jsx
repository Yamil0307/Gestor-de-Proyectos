import React, { createContext, useState, useContext } from 'react';
import ConfirmDialog from '../components/common/ConfirmDialog';

const ConfirmationContext = createContext(null);

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  
  if (!context) {
    throw new Error('useConfirmation debe ser usado dentro de un ConfirmationProvider');
  }
  
  return context;
};

export const ConfirmationProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    open: false,
    title: '',
    message: '',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    severity: 'warning',
    onConfirm: () => {},
    onCancel: () => {}
  });

  const showConfirmation = ({
    title = 'Confirmar acción',
    message,
    confirmButtonText = 'Confirmar',
    cancelButtonText = 'Cancelar',
    severity = 'warning'
  }) => {
    return new Promise((resolve) => {
      setDialogState({
        open: true,
        title,
        message,
        confirmButtonText,
        cancelButtonText,
        severity,
        onConfirm: () => {
          setDialogState(prev => ({ ...prev, open: false }));
          resolve(true);
        },
        onCancel: () => {
          setDialogState(prev => ({ ...prev, open: false }));
          resolve(false);
        }
      });
    });
  };

  const handleClose = () => {
    setDialogState(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <ConfirmationContext.Provider value={{ showConfirmation }}>
      {children}
      <ConfirmDialog
        open={dialogState.open}
        title={dialogState.title}
        message={dialogState.message}
        confirmButtonText={dialogState.confirmButtonText}
        cancelButtonText={dialogState.cancelButtonText}
        severity={dialogState.severity}
        onConfirm={dialogState.onConfirm}
        onCancel={dialogState.onCancel}
      />
    </ConfirmationContext.Provider>
  );
};
