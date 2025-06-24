import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip, Box } from '@mui/material';
import { formatDate } from '../../utils/dateUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const downloadProjectTxt = async (projectId) => {
  try {
    const response = await fetch(`${API_URL}/projects/${projectId}/export-txt`);
    if (!response.ok) throw new Error('No se pudo descargar el archivo');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proyecto_${projectId}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    alert('Error al descargar el archivo: ' + error.message);
  }
};

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
        <Button size="small" color="secondary" onClick={() => downloadProjectTxt(project.id)}>
          Exportar
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;