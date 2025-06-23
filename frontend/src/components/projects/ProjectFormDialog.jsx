import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, FormControl, InputLabel, MenuItem, Select, Grid 
} from '@mui/material';
import { teamService } from '../../services/teamService';

const ProjectFormDialog = ({ open, onClose, onSubmit, project = null }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    estimated_time: '',
    price: '',
    team_id: '',
    type: 'management',
    // Para proyectos de gestión
    database_type: '',
    programming_language: '',
    framework: '',
    // Para proyectos multimedia
    development_tool: ''
  });

  useEffect(() => {
    if (open) {
      loadTeams();
      
      if (project) {
        // Si estamos editando, rellenamos el formulario
        const startDate = project.start_date ? project.start_date.split('T')[0] : '';
        const endDate = project.end_date ? project.end_date.split('T')[0] : '';
        
        setForm({
          name: project.name || '',
          description: project.description || '',
          start_date: startDate,
          end_date: endDate,
          estimated_time: project.estimated_time?.toString() || '',
          price: project.price?.toString() || '',
          team_id: project.team_id?.toString() || '',
          type: project.type || 'management',
          
          // Inicializamos campos específicos
          database_type: '',
          programming_language: '',
          framework: '',
          development_tool: ''
        });
        
        // Cargamos datos específicos según tipo
        if (project.type === 'management' && project.management_project) {
          setForm(prev => ({
            ...prev,
            database_type: project.management_project.database_type || '',
            programming_language: project.management_project.programming_language || '',
            framework: project.management_project.framework || ''
          }));
        } else if (project.type === 'multimedia' && project.multimedia_project) {
          setForm(prev => ({
            ...prev,
            development_tool: project.multimedia_project.development_tool || ''
          }));
        }
      } else {
        // Si es nuevo, reseteamos el formulario
        resetForm();
      }
    }
  }, [open, project]);

  const loadTeams = async () => {
    setLoading(true);
    try {
      const teamsData = await teamService.getTeams();
      setTeams(teamsData);
    } catch (error) {
      console.error('Error cargando equipos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      estimated_time: '',
      price: '',
      team_id: '',
      type: 'management',
      database_type: '',
      programming_language: '',
      framework: '',
      development_tool: ''
    });
  };

  // Mostrar campos según tipo de proyecto
  const renderSpecificFields = () => {
    if (form.type === 'management') {
      return (
        <>
          <TextField
            margin="dense"
            name="database_type"
            label="Tipo de Base de Datos"
            type="text"
            fullWidth
            variant="outlined"
            value={form.database_type}
            onChange={handleInputChange}
          />
          
          <TextField
            margin="dense"
            name="programming_language"
            label="Lenguaje de Programación"
            type="text"
            fullWidth
            variant="outlined"
            value={form.programming_language}
            onChange={handleInputChange}
          />
          
          <TextField
            margin="dense"
            name="framework"
            label="Framework"
            type="text"
            fullWidth
            variant="outlined"
            value={form.framework}
            onChange={handleInputChange}
          />
        </>
      );
    } else {
      return (
        <TextField
          margin="dense"
          name="development_tool"
          label="Herramienta de Desarrollo"
          type="text"
          fullWidth
          variant="outlined"
          value={form.development_tool}
          onChange={handleInputChange}
        />
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{project ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                name="name"
                label="Nombre del Proyecto"
                type="text"
                fullWidth
                variant="outlined"
                value={form.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="type-label">Tipo de Proyecto</InputLabel>
                <Select
                  labelId="type-label"
                  name="type"
                  value={form.type}
                  label="Tipo de Proyecto"
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="management">Gestión</MenuItem>
                  <MenuItem value="multimedia">Multimedia</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="description"
                label="Descripción"
                type="text"
                multiline
                rows={2}
                fullWidth
                variant="outlined"
                value={form.description}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                name="start_date"
                label="Fecha de Inicio"
                type="date"
                fullWidth
                variant="outlined"
                value={form.start_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                name="end_date"
                label="Fecha de Fin"
                type="date"
                fullWidth
                variant="outlined"
                value={form.end_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                name="estimated_time"
                label="Tiempo Estimado (horas)"
                type="number"
                fullWidth
                variant="outlined"
                value={form.estimated_time}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                name="price"
                label="Precio ($)"
                type="number"
                fullWidth
                variant="outlined"
                value={form.price}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="team-label">Equipo</InputLabel>
                <Select
                  labelId="team-label"
                  name="team_id"
                  value={form.team_id}
                  label="Equipo"
                  onChange={handleInputChange}
                  required
                  disabled={!!project} // Deshabilitar cambio de equipo al editar
                >
                  {teams.map(team => (
                    <MenuItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <div className="project-specific-fields">
                <h4>{form.type === 'management' ? 'Detalles de Gestión' : 'Detalles Multimedia'}</h4>
                {renderSpecificFields()}
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {project ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectFormDialog;