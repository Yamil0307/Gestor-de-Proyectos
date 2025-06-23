import React from 'react';
import { 
  Card, CardContent, Typography, Box, 
  Divider, List, ListItem, ListItemText, 
  ListItemAvatar, Avatar
} from '@mui/material';
import { 
  AttachMoney as MoneyIcon,
  EmojiEvents as TrophyIcon 
} from '@mui/icons-material';

const FinancialStats = ({ totalSalary = 0, highestPaidEmployees = [] }) => {
  // Formatear el salario como moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };
  
  // Obtener iniciales del nombre completo
  const getInitials = (name) => {
    if (!name) return '?';
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0][0];
    return nameParts[0][0] + nameParts[nameParts.length - 1][0];
  };

  return (
    <Card sx={{ width: '100%', mt: 3, borderRadius: 0 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MoneyIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Estadísticas Financieras
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {/* Total de Nómina Mensual */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Total de Nómina Mensual
          </Typography>
          <Typography variant="h4" component="div" color="primary" fontWeight="bold">
            {formatCurrency(totalSalary)}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Empleados Mejor Pagados */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <TrophyIcon fontSize="small" sx={{ mr: 1 }} /> 
            Empleados Mejor Pagados
          </Typography>
          
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {Array.isArray(highestPaidEmployees) && highestPaidEmployees.length > 0 ? (
              highestPaidEmployees.map((employee, index) => (
                <ListItem 
                  key={employee?.employee_id || index}
                  sx={{
                    p: 1,
                    borderBottom: index < highestPaidEmployees.length - 1 ? '1px solid rgba(0, 0, 0, 0.08)' : 'none'
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      {getInitials(employee?.name)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={employee?.name || 'Desconocido'} 
                    secondary={`${formatCurrency(employee?.total_salary || 0)}`} 
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No hay información de salarios disponible" />
              </ListItem>
            )}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FinancialStats;