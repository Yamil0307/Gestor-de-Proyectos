import { createTheme } from '@mui/material/styles';

// Colores personalizados basados en el diseño actual
const customColors = {
  primary: {
    light: '#8a9ff8',
    main: '#667eea',
    dark: '#4c5fd7',
    contrastText: '#ffffff',
  },
  secondary: {
    light: '#9b7bc4',
    main: '#764ba2',
    dark: '#5a3a7a',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
  },
  grey: {
    100: '#f5f5f5',
    200: '#e1e1e1',
    300: '#cccccc',
    400: '#999999',
    500: '#666666',
    600: '#333333',
  },
  error: {
    light: '#ffcdd2',
    main: '#f44336',
    dark: '#d32f2f',
    contrastText: '#ffffff',
  },
  warning: {
    light: '#fff3cd',
    main: '#ff9800',
    dark: '#e65100',
    contrastText: '#ffffff',
  },
  info: {
    light: '#d1ecf1',
    main: '#2196f3',
    dark: '#1976d2',
    contrastText: '#ffffff',
  },
  success: {
    light: '#d4edda',
    main: '#4caf50',
    dark: '#388e3c',
    contrastText: '#ffffff',
  },
};

// Crear el tema personalizado
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: customColors.primary,
    secondary: customColors.secondary,
    background: customColors.background,
    text: customColors.text,
    grey: customColors.grey,
    error: customColors.error,
    warning: customColors.warning,
    info: customColors.info,
    success: customColors.success,
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: customColors.text.primary,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: customColors.text.primary,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: customColors.text.primary,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: customColors.text.primary,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: customColors.text.primary,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: customColors.text.primary,
    },
    body1: {
      fontSize: '1rem',
      color: customColors.text.primary,
    },
    body2: {
      fontSize: '0.875rem',
      color: customColors.text.secondary,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none', // Evita que los botones estén en mayúsculas
    },
  },
  components: {
    // Personalizar componentes específicos
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${customColors.primary.main} 0%, ${customColors.secondary.main} 100%)`,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            background: `linear-gradient(135deg, ${customColors.primary.dark} 0%, ${customColors.secondary.dark} 100%)`,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 5,
            '& fieldset': {
              borderColor: customColors.grey[200],
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: customColors.primary.light,
            },
            '&.Mui-focused fieldset': {
              borderColor: customColors.primary.main,
            },
          },
          '& .MuiInputLabel-root': {
            color: customColors.text.secondary,
            fontWeight: 500,
          },
          '& .MuiInputBase-input': {
            padding: '12px 14px',
            fontSize: '1rem',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
          border: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
        elevation1: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        elevation3: {
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${customColors.primary.main} 0%, ${customColors.secondary.main} 100%)`,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: customColors.grey[100],
            fontWeight: 600,
            color: customColors.text.primary,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${customColors.grey[200]}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          fontWeight: 500,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 10,
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
            borderColor: customColors.grey[200],
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: customColors.primary.light,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: customColors.primary.main,
          },
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
  },
  spacing: 8, // Espaciado base de 8px
  shape: {
    borderRadius: 5, // Border radius por defecto
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;
