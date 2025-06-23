import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip, Box } from '@mui/material';
import { formatDate } from '../../utils/dateUtils';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  // Determinar detalles específicos según tipo de proyecto
  const renderSpecificDetails = () => {
    if (project.type === 'management' && project.management_project) {
      return (
        <Box mt={2}>
          <Typography variant="body2"><strong>Base de datos:</strong> {project.management_project.database_type}</Typography>
          <Typography variant="body2"><strong>Lenguaje:</strong> {project.management_project.programming_language}</Typography>
          <Typography variant="body2"><strong>Framework:</strong> {project.management_project.framework}</Typography>
        </Box>
      );
    } else if (project.type === 'multimedia' && project.multimedia_project) {
      return (
        <Box mt={2}>
          <Typography variant="body2"><strong>Herramienta:</strong> {project.multimedia_project.development_tool}</Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {project.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {project.description}
        </Typography>
        
        <Typography variant="body2">
          <strong>Inicio:</strong> {formatDate(project.start_date)}
        </Typography>
        
        <Typography variant="body2">
          <strong>Fin:</strong> {formatDate(project.end_date)}
        </Typography>
        
        <Typography variant="body2">
          <strong>Tiempo estimado:</strong> {project.estimated_time} horas
        </Typography>
        
        <Typography variant="body2">
          <strong>Precio:</strong> ${project.price}
        </Typography>
        
        <Box mt={1}>
          <Chip 
            label={project.type === 'management' ? 'Gestión' : 'Multimedia'} 
            color={project.type === 'management' ? 'primary' : 'secondary'} 
            size="small" 
          />
        </Box>
        
        {renderSpecificDetails()}
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onEdit(project)}>Editar</Button>
        <Button size="small" color="error" onClick={() => onDelete(project)}>Eliminar</Button>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;