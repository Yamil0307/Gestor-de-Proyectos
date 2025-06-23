import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, LabelList 
} from 'recharts';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';

const ProjectsChart = ({ projectStats }) => {
  const theme = useTheme();
  
  // Comprobar si hay datos para mostrar
  const hasData = projectStats.lastWeek > 0 || projectStats.lastMonth > 0 || projectStats.total > 0;
  
  // Preparar datos para el gráfico con colores graduados
  const chartData = [
    { 
      name: 'Última Semana', 
      proyectos: projectStats.lastWeek, 
      fill: theme.palette.primary.light 
    },
    { 
      name: 'Último Mes', 
      proyectos: projectStats.lastMonth, 
      fill: theme.palette.primary.main 
    },
    { 
      name: 'Total', 
      proyectos: projectStats.total, 
      fill: theme.palette.primary.dark 
    }
  ];

  return (
    <Card sx={{ 
      width: '100%', 
      mt: 3, 
      boxShadow: 1, 
      borderRadius: 0, 
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
      }
    }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, textAlign: 'center' }}>
          Proyectos por Período
        </Typography>
        
        {!hasData ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography color="text.secondary" align="center">
              No hay datos de proyectos para mostrar en este período
            </Typography>
          </Box>
        ) : (
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis 
                  dataKey="name"
                  tick={{ fill: theme.palette.text.primary }}
                  tickLine={{ stroke: theme.palette.divider }}
                  axisLine={{ stroke: theme.palette.divider }}
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fill: theme.palette.text.primary }}
                  tickLine={{ stroke: theme.palette.divider }}
                  axisLine={{ stroke: theme.palette.divider }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 0
                  }} 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Bar 
                  dataKey="proyectos" 
                  name="Proyectos" 
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList dataKey="proyectos" position="top" fill={theme.palette.text.primary} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectsChart;