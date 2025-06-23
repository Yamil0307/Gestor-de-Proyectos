import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Grid, Chip, Box } from '@mui/material';

const ProjectList = ({ projects, onEdit, onDelete }) => {
  if (!projects.length) {
    return (
      <Box className="empty-state">
        <Typography variant="h6" color="text.secondary">
          No hay proyectos registrados.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} className="projects-grid">
      {projects.map((project) => (
        <Grid item xs={12} sm={6} md={4} key={project.id}>
          <Card className="project-card">
            <CardContent className="project-info">
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="h6" fontWeight="bold">{project.name}</Typography>
                <Chip
                  label={project.type === 'management' ? 'Gestión' : 'Multimedia'}
                  color={project.type === 'management' ? 'primary' : 'secondary'}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {project.description}
              </Typography>
              <Typography variant="body2"><b>Equipo:</b> {project.team_name || project.team_id}</Typography>
              <Typography variant="body2"><b>Tiempo estimado:</b> {project.estimated_time} días</Typography>
              <Typography variant="body2"><b>Precio:</b> ${project.price}</Typography>
              {project.type === 'management' && (
                <Box mt={2}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>Detalles de Gestión</Typography>
                  <Typography variant="body2"><b>Base de datos:</b> {project.database_type}</Typography>
                  <Typography variant="body2"><b>Lenguaje:</b> {project.programming_language}</Typography>
                  <Typography variant="body2"><b>Framework:</b> {project.framework}</Typography>
                </Box>
              )}
              {project.type === 'multimedia' && (
                <Box mt={2}>
                  <Typography variant="subtitle2" color="secondary" gutterBottom>Detalles Multimedia</Typography>
                  <Typography variant="body2"><b>Plataforma:</b> {project.platform}</Typography>
                </Box>
              )}
            </CardContent>
            <CardActions className="project-actions">
              <Button color="primary" onClick={() => onEdit(project)}>
                Editar
              </Button>
              <Button color="error" onClick={() => onDelete(project)}>
                Eliminar
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProjectList;