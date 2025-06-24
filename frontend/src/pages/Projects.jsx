import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { projectService } from '../services/projectService';
import { programmerService } from '../services/programmerService';
import { useNotification } from '../context/NotificationContext';
import { useConfirmation } from '../context/ConfirmationContext';
import { processApiError } from '../utils/errorUtils';
import ProjectList from '../components/projects/ProjectList';
import ProjectFormDialog from '../components/projects/ProjectFormDialog';
import ProjectLoading from '../components/projects/ProjectLoading';
import ProjectFilters from '../components/projects/ProjectFilters';
import '../pages/Projects.css';

// Hook personalizado para debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Establecer temporizador para retrasar actualización del valor
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar temporizador si el valor cambia antes del retraso
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Projects = ({ onDataChange }) => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    identityCard: ''
  });
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Mantener el debounce pero no usarlo para búsqueda automática
  const debouncedIdentityCard = useDebounce(filters.identityCard, 800);
  
  const { showSuccess, showError } = useNotification();
  const { showConfirmation } = useConfirmation();

  useEffect(() => {
    loadProjects();
  }, []);

  // Aplicar filtros regulares cuando cambien los proyectos, tipo o búsqueda por nombre
  useEffect(() => {
    // Si no hay carnet o está en proceso de filtrado, aplicar filtros regulares
    if (!filters.identityCard || filters.identityCard.trim() === '') {
      applyRegularFilters();
    }
  }, [filters.search, filters.type, projects]);

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
      setFilteredProjects(fullProjectsData);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      const { message } = processApiError(error, { defaultMessage: 'Error al cargar proyectos' });
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  // Filtros regulares (nombre y tipo)
  const applyRegularFilters = () => {
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
    setIsFiltering(false);
  };

  // Búsqueda explícita por carnet (cuando se presiona Enter)
  const searchByIdentityCard = async (identityCard) => {
    if (!identityCard || identityCard.trim() === '') {
      applyRegularFilters();
      return;
    }
    
    setIsFiltering(true);
    try {
      // Obtenemos el proyecto por carnet de identidad
      const project = await programmerService.getProjectByProgrammerIdentity(identityCard.trim());
      
      // Si encontramos un proyecto, aplicamos filtros adicionales a este único resultado
      if (project) {
        // Buscamos el proyecto completo en nuestra lista de proyectos (con detalles)
        const projectWithDetails = projects.find(p => p.id === project.id);
        
        let result = projectWithDetails ? [projectWithDetails] : [project];
        
        // Aplicamos filtros adicionales si existen
        if (filters.type && result[0].type !== filters.type) {
          result = [];
        }
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          result = result.filter(p => 
            p.name?.toLowerCase().includes(searchLower) || 
            p.description?.toLowerCase().includes(searchLower)
          );
        }
        
        setFilteredProjects(result);
      } else {
        setFilteredProjects([]);
      }
    } catch (error) {
      console.error('Error al filtrar por carnet:', error);
      // No mostramos error en notificación, solo dejamos la lista vacía
      setFilteredProjects([]);
    } finally {
      setIsFiltering(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Si se está limpiando el campo de carnet
    if (name === 'identityCard' && value === '') {
      applyRegularFilters();
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      identityCard: ''
    });
    applyRegularFilters();
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
      
      {/* Filtros - Pasamos función para búsqueda por carnet */}
      <ProjectFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        resultCount={filteredProjects.length}
        loading={isFiltering}
        onSearchByIdentity={searchByIdentityCard}
      />
      
      {/* Mensaje de carga para filtrado */}
      {isFiltering && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Buscando proyecto...
          </Typography>
        </Box>
      )}
      
      {/* Lista de proyectos o mensaje "No hay resultados" */}
      {!isFiltering && filteredProjects.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            {filters.identityCard ? 
              `No se encontraron proyectos para el programador con carnet ${filters.identityCard}` :
              "No se encontraron proyectos con los filtros actuales"}
          </Typography>
        </Box>
      ) : (
        !isFiltering && <ProjectList 
          projects={filteredProjects}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      
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