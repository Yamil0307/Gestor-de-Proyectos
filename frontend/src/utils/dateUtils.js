/**
 * Formatea una fecha en formato ISO a formato legible
 * @param {string} isoDate - Fecha en formato ISO
 * @returns {string} Fecha formateada (DD/MM/YYYY)
 */
export const formatDate = (isoDate) => {
  if (!isoDate) return 'No definido';
  
  const date = new Date(isoDate);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Calcula la diferencia en días entre dos fechas
 * @param {string} startDate - Fecha de inicio en formato ISO
 * @param {string} endDate - Fecha de fin en formato ISO
 * @returns {number} Diferencia en días
 */
export const getDaysDifference = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};