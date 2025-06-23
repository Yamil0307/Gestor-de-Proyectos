import React from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { AccessTime as AccessTimeIcon } from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';

const NextProjectCard = ({ project }) => {
  if (!project) {
    return (
      <Card sx={{ width: '100%', mt: 3, borderRadius: 0 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <AccessTimeIcon fontSize="large" color="primary" />
          <Typography variant="h6" gutterBottom>
            Próximo proyecto a terminar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No hay proyectos programados
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ width: '100%', mt: 3, borderRadius: 0 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccessTimeIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Próximo proyecto a terminar
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Typography variant="h5" component="div" gutterBottom>
          {project.name}
        </Typography>
        
        {project.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {project.description}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Finaliza el:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatDate(project.end_date)}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Tiempo estimado:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {project.estimated_time} horas
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Tipo:
            </Typography>
            <Typography variant="body1" fontWeight="medium" color={project.type === 'management' ? 'primary' : 'secondary'}>
              {project.type === 'management' ? 'Gestión' : 'Multimedia'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NextProjectCard;