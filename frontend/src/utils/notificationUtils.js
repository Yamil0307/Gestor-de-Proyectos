/**
 * Utilidades para gestión de notificaciones en toda la aplicación
 */
import { processApiError } from './errorUtils';

/**
 * Función para manejar operaciones asíncronas con notificaciones automáticas
 * 
 * @param {Function} asyncFunction - La función asíncrona a ejecutar
 * @param {Object} options - Opciones adicionales
 * @param {Function} options.onSuccess - Callback a ejecutar en caso de éxito
 * @param {Function} options.onError - Callback a ejecutar en caso de error
 * @param {string} options.successMessage - Mensaje a mostrar en caso de éxito
 * @param {string} options.errorMessage - Mensaje predeterminado en caso de error
 * @param {Object} options.notificationHandlers - Objeto con los handlers de notificación
 * @returns {Promise<*>} - Devuelve el resultado de la función async o undefined en caso de error
 */
export const handleAsyncOperation = async (
  asyncFunction,
  { 
    onSuccess, 
    onError, 
    successMessage, 
    errorMessage = 'Ha ocurrido un error',
    notificationHandlers
  }
) => {
  const { showSuccess, showError, showWarning } = notificationHandlers;
  
  try {
    const result = await asyncFunction();
    
    if (successMessage) {
      showSuccess(successMessage);
    }
    
    if (onSuccess) {
      onSuccess(result);
    }
    
    return result;
  } catch (error) {
    console.error(`Error en operación asíncrona:`, error);
    
    const { message } = processApiError(error, { defaultMessage: errorMessage });
    showError(message);
    
    // Mostrar advertencia adicional para ciertos tipos de errores
    if (message.includes('asignado') || message.includes('asociado')) {
      showWarning('Es posible que este recurso tenga dependencias que deben resolverse primero');
    }
    
    if (onError) {
      onError(error, message);
    }
    
    return undefined;
  }
};
