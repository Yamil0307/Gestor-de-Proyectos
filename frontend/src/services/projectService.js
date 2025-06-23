import api from './authService';
import { processApiError } from '../utils/errorUtils';

// PROYECTOS GENERALES
async function getProjects(skip = 0, limit = 100) {
  try {
    const response = await api.get(`/projects/?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: 'Error al obtener la lista de proyectos' });
  }
}

async function getProject(id) {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: `Error al obtener el proyecto con ID ${id}` });
  }
}

async function createProject(projectData) {
  try {
    const response = await api.post('/projects/', projectData);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: 'Error al crear el proyecto' });
  }
}

async function updateProject(id, projectData) {
  try {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: `Error al actualizar el proyecto con ID ${id}` });
  }
}

async function deleteProject(id) {
  try {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: `Error al eliminar el proyecto con ID ${id}` });
  }
}

// PROYECTOS DE GESTIÓN
async function getManagementProjects(skip = 0, limit = 100) {
  try {
    const response = await api.get(`/management-projects/?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: 'Error al obtener proyectos de gestión' });
  }
}

async function getManagementProject(id) {
  try {
    const response = await api.get(`/management-projects/${id}`);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: `Error al obtener el proyecto de gestión con ID ${id}` });
  }
}

async function createManagementProject(data) {
  try {
    const response = await api.post('/management-projects/', data);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: 'Error al crear el proyecto de gestión' });
  }
}

async function updateManagementProject(id, data) {
  try {
    const response = await api.put(`/management-projects/${id}`, data);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: 'Error al actualizar el proyecto de gestión' });
  }
}

async function deleteManagementProject(id) {
  try {
    const response = await api.delete(`/management-projects/${id}`);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: `Error al eliminar el proyecto de gestión con ID ${id}` });
  }
}

// PROYECTOS MULTIMEDIA
async function getMultimediaProjects(skip = 0, limit = 100) {
  try {
    const response = await api.get(`/multimedia-projects/?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: 'Error al obtener proyectos multimedia' });
  }
}

async function getMultimediaProject(id) {
  try {
    const response = await api.get(`/multimedia-projects/${id}`);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: `Error al obtener el proyecto multimedia con ID ${id}` });
  }
}

async function createMultimediaProject(data) {
  try {
    const response = await api.post('/multimedia-projects/', data);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: 'Error al crear el proyecto multimedia' });
  }
}

async function updateMultimediaProject(id, data) {
  try {
    const response = await api.put(`/multimedia-projects/${id}`, data);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: 'Error al actualizar el proyecto multimedia' });
  }
}

async function deleteMultimediaProject(id) {
  try {
    const response = await api.delete(`/multimedia-projects/${id}`);
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: `Error al eliminar el proyecto multimedia con ID ${id}` });
  }
}

// NUEVA FUNCIÓN - Obtener el proyecto más próximo a terminar
async function getEarliestProject() {
  try {
    const response = await api.get('/analytics/earliest-project');
    return response.data;
  } catch (error) {
    throw processApiError(error, { defaultMessage: 'Error al obtener el proyecto más próximo a terminar' });
  }
}

export const projectService = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getManagementProjects,
  getManagementProject,
  createManagementProject,
  updateManagementProject,
  deleteManagementProject,
  getMultimediaProjects,
  getMultimediaProject,
  createMultimediaProject,
  updateMultimediaProject,
  deleteMultimediaProject,
  getEarliestProject // Nueva función
};