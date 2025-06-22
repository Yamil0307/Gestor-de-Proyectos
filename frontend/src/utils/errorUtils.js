/**
 * Utilidad para formatear y manejar errores en toda la aplicación
 */

/**
 * Formatea un mensaje de error de la API en un formato legible para el usuario
 * @param {Object|string} error - El objeto o string de error
 * @param {string} defaultMessage - Mensaje predeterminado si no se puede extraer del error
 * @returns {string} - Mensaje de error formateado
 */
export const formatErrorMessage = (error, defaultMessage = 'Ha ocurrido un error') => {
  // Si es string, devolver directamente
  if (typeof error === 'string') {
    return error;
  }

  // Intentar extraer el detalle del error
  if (error) {
    // Si el error viene directamente de la API
    if (error.detail) {
      if (typeof error.detail === 'string') {
        return error.detail;
      }
      
      // Si es un array de errores (validación)
      if (Array.isArray(error.detail)) {
        const firstError = error.detail[0];
        if (firstError) {
          // Formatear mensaje de validación
          if (firstError.loc && firstError.msg) {
            const field = firstError.loc[firstError.loc.length - 1];
            return `Error en campo ${field}: ${firstError.msg}`;
          }
          return firstError.msg || JSON.stringify(firstError);
        }
      }
    }
    
    // Intentar extraer otros tipos de mensajes de error
    if (error.message) {
      return error.message;
    }
    
    // Si es un objeto pero no tiene campos reconocibles
    if (typeof error === 'object') {
      try {
        return JSON.stringify(error);
      } catch (e) {
        return defaultMessage;
      }
    }
  }
  
  // Si todo falla, devolver el mensaje predeterminado
  return defaultMessage;
};

/**
 * Función helper para procesar errores en servicios
 * @param {Object} error - Error capturado de axios o API
 * @param {Object} options - Opciones adicionales
 * @returns {Object} - Error formateado
 */
export const processApiError = (error, options = {}) => {
  const { defaultMessage = 'Error en la comunicación con el servidor' } = options;
  
  // Si es error de red/conexión
  if (error.message === 'Network Error') {
    return { message: 'Error de conexión: No se pudo conectar con el servidor' };
  }
  
  // Si es error de timeout
  if (error.code === 'ECONNABORTED') {
    return { message: 'Tiempo de espera agotado: El servidor tardó demasiado en responder' };
  }
  
  // Si el error viene con una respuesta HTTP
  if (error.response) {
    const { status, data } = error.response;
    
    // Mensajes específicos según el código HTTP
    if (status === 401) {
      return { message: 'Error de autenticación: Tu sesión ha expirado o no tienes permisos' };
    }
    
    if (status === 404) {
      return { message: formatErrorMessage(data, 'Recurso no encontrado') };
    }
    
    if (status === 400) {
      return { message: formatErrorMessage(data, 'Datos incorrectos en la solicitud') };
    }
    
    if (status === 422) {
      return { message: formatErrorMessage(data, 'No se puede completar la operación. Verifique los datos.') };
    }
    
    if (status === 500) {
      return { message: formatErrorMessage(data, 'Error interno del servidor') };
    }
    
    // Si hay datos en la respuesta, intentar formatear
    if (data) {
      return { message: formatErrorMessage(data, defaultMessage) };
    }
  }
  
  // Si el error es de axios pero sin respuesta
  if (error.request) {
    return { message: 'No se recibió respuesta del servidor' };
  }
  
  // Para otros tipos de errores
  return { message: formatErrorMessage(error, defaultMessage) };
};
