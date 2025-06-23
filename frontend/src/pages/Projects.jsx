import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { projectService } from '../services/projectService';
import { useNotification } from '../context/NotificationContext';
import { useConfirmation } from '../context/ConfirmationContext';
import ProjectHeader from '../components/projects/ProjectHeader';
import ProjectList from '../components/projects/ProjectList';
import ProjectFormDialog from '../components/projects/ProjectFormDialog';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const { showSuccess, showError } = useNotification();
  const { showConfirmation } = useConfirmation();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      showError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = () => {
    setEditingProject(null);
    setFormOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormOpen(true);
  };

  const handleDelete = (project) => {
    showConfirmation({
      title: 'Eliminar proyecto',
      message: `¿Seguro que deseas eliminar el proyecto "${project.name}"?`,
      onConfirm: async () => {
        try {
          await projectService.deleteProject(project.id);
          showSuccess('Proyecto eliminado');
          fetchProjects();
        } catch (error) {
          showError(error.message);
        }
      }
    });
  };

  const handleFormClose = (saved) => {
    setFormOpen(false);
    setEditingProject(null);
    if (saved) fetchProjects();
  };

  return (
    <Box p={3}>
      <ProjectHeader onNewProject={handleCreate} />
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>
      ) : (
        <ProjectList
          projects={projects}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      <ProjectFormDialog
        open={formOpen}
        onClose={handleFormClose}
        project={editingProject}
      />
    </Box>
  );
};

export default Projects;