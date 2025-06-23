import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { projectService } from '../services/projectService';
import { useNotification } from '../context/NotificationContext';
import { useConfirmation } from '../context/ConfirmationContext';
import { processApiError } from '../utils/errorUtils';
import ProjectList from '../components/projects/ProjectList';
import ProjectFormDialog from '../components/projects/ProjectFormDialog';
import ProjectLoading from '../components/projects/ProjectLoading';
import ProjectFilters from '../components/projects/ProjectFilters';
import '../pages/Projects.css';

const Projects = ({ onDataChange }) => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: ''
  });
  
  const { showSuccess, showError } = useNotification();
  const { showConfirmation } = useConfirmation();

  useEffect(() => {
    loadProjects();
  }, []);

  // Aplicar filtros cuando cambien los proyectos o los filtros
  useEffect(() => {
    applyFilters();
  }, [filters, projects]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const projectsData = await projectService.getProjects();
      
      // Para cada proyecto, cargamos sus detalles específicos
      const fullProjectsData = await Promise.all(projectsData.map(async project => {
        if (project.type === 'management') {
          try {
            const managementDetails = await projectService.getManagementProject(project.id);
            return { ...project, management_project: managementDetails };
          } catch (error) {
            console.error(`Error cargando detalles de gestión para proyecto ${project.id}:`, error);
            return project;
          }
        } else if (project.type === 'multimedia') {
          try {
            const multimediaDetails = await projectService.getMultimediaProject(project.id);
            return { ...project, multimedia_project: multimediaDetails };
          } catch (error) {
            console.error(`Error cargando detalles multimedia para proyecto ${project.id}:`, error);
            return project;
          }
        }
        return project;
      }));
      
      setProjects(fullProjectsData);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      const { message } = processApiError(error, { defaultMessage: 'Error al cargar proyectos' });
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...projects];
    
    // Filtrar por tipo de proyecto
    if (filters.type) {
      result = result.filter(project => project.type === filters.type);
    }
    
    // Filtrar por búsqueda de texto
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(project => 
        project.name.toLowerCase().includes(searchLower) || 
        project.description?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredProjects(result);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: ''
    });
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingProject) {
        // Actualizar proyecto existente
        if (formData.type === 'management') {
          // Actualizar proyecto base
          const projectUpdate = {
            name: formData.name,
            description: formData.description,
            start_date: formData.start_date,
            end_date: formData.end_date,
            estimated_time: parseInt(formData.estimated_time),
            price: parseFloat(formData.price)
          };
          await projectService.updateProject(editingProject.id, projectUpdate);
          
          // Actualizar detalles de gestión
          const managementUpdate = {
            database_type: formData.database_type,
            programming_language: formData.programming_language,
            framework: formData.framework
          };
          await projectService.updateManagementProject(editingProject.id, managementUpdate);
          
        } else { // multimedia
          // Actualizar proyecto base
          const projectUpdate = {
            name: formData.name,
            description: formData.description,
            start_date: formData.start_date,
            end_date: formData.end_date,
            estimated_time: parseInt(formData.estimated_time),
            price: parseFloat(formData.price)
          };
          await projectService.updateProject(editingProject.id, projectUpdate);
          
          // Actualizar detalles multimedia
          const multimediaUpdate = {
            development_tool: formData.development_tool
          };
          await projectService.updateMultimediaProject(editingProject.id, multimediaUpdate);
        }
        
        showSuccess('Proyecto actualizado exitosamente');
      } else {
        // Crear nuevo proyecto
        if (formData.type === 'management') {
          // Crear proyecto de gestión
          const newProject = {
            project_data: {
              name: formData.name,
              description: formData.description,
              start_date: formData.start_date,
              end_date: formData.end_date,
              estimated_time: parseInt(formData.estimated_time),
              price: parseFloat(formData.price),
              team_id: parseInt(formData.team_id),
              type: 'management'
            },
            database_type: formData.database_type,
            programming_language: formData.programming_language,
            framework: formData.framework
          };
          
          await projectService.createManagementProject(newProject);
          showSuccess('Proyecto de gestión creado exitosamente');
          
        } else { // multimedia
          // Crear proyecto multimedia
          const newProject = {
            project_data: {
              name: formData.name,
              description: formData.description,
              start_date: formData.start_date,
              end_date: formData.end_date,
              estimated_time: parseInt(formData.estimated_time),
              price: parseFloat(formData.price),
              team_id: parseInt(formData.team_id),
              type: 'multimedia'
            },
            development_tool: formData.development_tool
          };
          
          await projectService.createMultimediaProject(newProject);
          showSuccess('Proyecto multimedia creado exitosamente');
        }
      }
      
      setShowForm(false);
      setEditingProject(null);
      loadProjects();
      
      // Notificar al Dashboard sobre el cambio
      if (onDataChange && typeof onDataChange === 'function') {
        onDataChange();
      }
      
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
      const { message } = processApiError(error, { defaultMessage: 'Error al guardar el proyecto' });
      showError(message);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (project) => {
    const confirmed = await showConfirmation({
      title: 'Eliminar Proyecto',
      message: `¿Estás seguro de eliminar el proyecto de ${projectType} "${project.name}"? Esta acción no se puede deshacer.`,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      severity: 'error'
    });
    
    if (confirmed) {
      try {
        if (project.type === 'management') {
          await projectService.deleteManagementProject(project.id);
        } else {
          await projectService.deleteMultimediaProject(project.id);
        }
        
        showSuccess('Proyecto eliminado exitosamente');
        loadProjects();
        
        // Notificar al Dashboard sobre el cambio
        if (onDataChange && typeof onDataChange === 'function') {
          onDataChange();
        }
      } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        const { message } = processApiError(error, { defaultMessage: 'Error al eliminar el proyecto' });
        showError(message);
      }
    }
  };

  if (loading) {
    return <ProjectLoading />;
  }

  return (
    <Box p={3}>
      {/* Cabecera con título y botón para agregar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Proyectos
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingProject(null);
            setShowForm(true);
          }}
        >
          Nuevo Proyecto
        </Button>
      </Box>
      
      {/* Filtros - Pasamos el contador de resultados */}
      <ProjectFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        resultCount={filteredProjects.length}
      />
      
      {/* Lista de proyectos */}
      <ProjectList 
        projects={filteredProjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      {/* Modal para crear/editar proyectos */}
      <ProjectFormDialog 
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingProject(null);
        }}
        onSubmit={handleSubmit}
        project={editingProject}
      />
    </Box>
  );
};

Projects.defaultProps = {
  onDataChange: () => {}
};

export default Projects;