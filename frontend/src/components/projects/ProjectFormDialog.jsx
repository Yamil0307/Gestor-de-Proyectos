import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Box, Typography
} from '@mui/material';
import { projectService } from '../../services/projectService';
import { useNotification } from '../../context/NotificationContext';

const initialForm = {
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  estimated_time: '',
  price: '',
  team_id: '',
  type: 'management',
  // Específicos de management
  database_type: '',
  programming_language: '',
  framework: '',
  // Específico de multimedia
  platform: ''
};

const ProjectFormDialog = ({ open, onClose, project }) => {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useNotification();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await import('../../services/teamService').then(m => m.teamService.getTeams());
        setTeams(response);
      } catch (error) {
        showError('Error al cargar equipos');
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || '',
        description: project.description || '',
        start_date: project.start_date ? project.start_date.slice(0, 10) : '',
        end_date: project.end_date ? project.end_date.slice(0, 10) : '',
        estimated_time: project.estimated_time || '',
        price: project.price || '',
        team_id: project.team_id || '',
        type: project.type || 'management',
        database_type: project.database_type || '',
        programming_language: project.programming_language || '',
        framework: project.framework || '',
        platform: project.platform || ''
      });
    } else {
      setForm(initialForm);
    }
  }, [project, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name || !form.estimated_time || !form.price || !form.team_id || !form.type) {
      showError('Complete todos los campos obligatorios');
      return false;
    }
    if (form.type === 'management' && (!form.database_type || !form.programming_language || !form.framework)) {
      showError('Complete todos los campos de proyecto de gestión');
      return false;
    }
    if (form.type === 'multimedia' && !form.platform) {
      showError('Seleccione la plataforma de multimedia');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (form.type === 'management') {
        const payload = {
          project_data: {
            name: form.name,
            description: form.description,
            start_date: form.start_date,
            end_date: form.end_date,
            estimated_time: parseInt(form.estimated_time),
            price: parseFloat(form.price),
            team_id: form.team_id,
            type: 'management'
          },
          database_type: form.database_type,
          programming_language: form.programming_language,
          framework: form.framework
        };
        if (project) {
          await projectService.updateManagementProject(project.id, payload);
          showSuccess('Proyecto de gestión actualizado');
        } else {
          await projectService.createManagementProject(payload);
          showSuccess('Proyecto de gestión creado');
        }
      } else if (form.type === 'multimedia') {
        const payload = {
          project_data: {
            name: form.name,
            description: form.description,
            start_date: form.start_date,
            end_date: form.end_date,
            estimated_time: parseInt(form.estimated_time),
            price: parseFloat(form.price),
            team_id: form.team_id,
            type: 'multimedia'
          },
          development_tool: form.platform // O el campo correcto según tu backend
        };
        if (project) {
          await projectService.updateMultimediaProject(project.id, payload);
          showSuccess('Proyecto multimedia actualizado');
        } else {
          await projectService.createMultimediaProject(payload);
          showSuccess('Proyecto multimedia creado');
        }
      }
      onClose(true);
    } catch (error) {
      showError(error.message);
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{project ? 'Editar Proyecto' : 'Nuevo Proyecto'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
                autoFocus
                inputProps={{ minLength: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={2}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Fecha de inicio"
                name="start_date"
                type="date"
                value={form.start_date}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Fecha de fin"
                name="end_date"
                type="date"
                value={form.end_date}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Tiempo estimado (días)"
                name="estimated_time"
                type="number"
                value={form.estimated_time}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Precio de venta"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Equipo asignado"
                name="team_id"
                value={form.team_id}
                onChange={handleChange}
                fullWidth
                required
                SelectProps={{ native: true }}
              >
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Tipo de proyecto"
                name="type"
                value={form.type}
                onChange={handleChange}
                fullWidth
                required
                SelectProps={{ native: true }}
                disabled={!!project}
              >
                <option value="management">Gestión</option>
                <option value="multimedia">Multimedia</option>
              </TextField>
            </Grid>

            {/* Campos específicos según tipo */}
            {form.type === 'management' && (
              <Grid item xs={12}>
                <Box className="form-group specific-fields">
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Datos específicos de Gestión</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Base de datos"
                        name="database_type"
                        value={form.database_type}
                        onChange={handleChange}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Lenguaje de programación"
                        name="programming_language"
                        value={form.programming_language}
                        onChange={handleChange}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Framework"
                        name="framework"
                        value={form.framework}
                        onChange={handleChange}
                        fullWidth
                        required
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}
            {form.type === 'multimedia' && (
              <Grid item xs={12}>
                <Box className="form-group specific-fields">
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Datos específicos de Multimedia</Typography>
                  <TextField
                    select
                    label="Plataforma"
                    name="platform"
                    value={form.platform}
                    onChange={handleChange}
                    fullWidth
                    required
                    SelectProps={{ native: true }}
                  >
                    <option value="flash">Flash</option>
                    <option value="director">Director</option>
                  </TextField>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={saving}>
            {project ? 'Guardar cambios' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectFormDialog;