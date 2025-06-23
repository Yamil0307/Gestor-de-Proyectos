import api from './authService';
import { processApiError } from '../utils/errorUtils';

// Obtener proyectos
async function getProjects(skip = 0, limit = 100) {
  try {
    const response = await api.get(`/projects/?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: 'Error al obtener la lista de proyectos' });
  }
}

// Obtener proyecto por ID
async function getProject(id) {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: `Error al obtener el proyecto con ID ${id}` });
  }
}

// Crear proyecto
async function createProject(projectData) {
  try {
    const response = await api.post('/projects/', projectData);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: 'Error al crear el proyecto' });
  }
}

// Actualizar proyecto
async function updateProject(id, projectData) {
  try {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: `Error al actualizar el proyecto con ID ${id}` });
  }
}

// Eliminar proyecto
async function deleteProject(id) {
  try {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: `Error al eliminar el proyecto con ID ${id}` });
  }
}

// Crear proyecto de gestión
async function createManagementProject(data) {
  try {
    const response = await api.post('/management-projects/', data);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: 'Error al crear el proyecto de gestión' });
  }
}

// Crear proyecto multimedia
async function createMultimediaProject(data) {
  try {
    const response = await api.post('/multimedia-projects/', data);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: 'Error al crear el proyecto multimedia' });
  }
}

// Actualizar proyecto de gestión
async function updateManagementProject(id, data) {
  try {
    const response = await api.put(`/management-projects/${id}`, data);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: 'Error al actualizar el proyecto de gestión' });
  }
}

// Actualizar proyecto multimedia
async function updateMultimediaProject(id, data) {
  try {
    const response = await api.put(`/multimedia-projects/${id}`, data);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: 'Error al actualizar el proyecto multimedia' });
  }
}

export const projectService = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  createManagementProject,
  createMultimediaProject,
  updateManagementProject,
  updateMultimediaProject,
};