import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import ProjectCard from './ProjectCard';

const ProjectList = ({ projects, onEdit, onDelete }) => {
  if (!projects || projects.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h6" color="text.secondary">
          No hay proyectos disponibles
        </Typography>
      </Box>
    );
  }
  
  return (
    <Grid container spacing={3}>
      {projects.map(project => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
          <ProjectCard 
            project={project} 
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProjectList;