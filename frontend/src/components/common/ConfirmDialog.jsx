import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button,
  Typography,
  Box
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const ConfirmDialog = ({ 
  open, 
  title = "Confirmar acción", 
  message, 
  confirmButtonText = "Confirmar", 
  cancelButtonText = "Cancelar",
  onConfirm, 
  onCancel,
  severity = "warning" // warning, error, info, success
}) => {
  
  // Mapa de colores según severidad
  const severityColors = {
    warning: "#ED6C02",  // naranja
    error: "#D32F2F",    // rojo
    info: "#0288D1",     // azul
    success: "#2E7D32"   // verde
  };
  
  // Color de texto para el botón de confirmación
  const buttonColors = {
    warning: "warning",
    error: "error",
    info: "primary",
    success: "success"
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        elevation: 5,
        sx: {
          borderRadius: 2,
          minWidth: '300px'
        }
      }}
    >
      <DialogTitle id="alert-dialog-title">
        <Box display="flex" alignItems="center" gap={1}>
          <WarningAmberIcon sx={{ color: severityColors[severity] }} />
          <Typography variant="h6">{title}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onCancel} 
          variant="outlined"
        >
          {cancelButtonText}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={buttonColors[severity]}
          autoFocus
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
