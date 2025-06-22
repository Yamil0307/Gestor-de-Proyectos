import React from 'react';

const LeaderFields = ({ formData, handleInputChange }) => {
  return (
    <>
      <div className="form-group">
        <label>Años de Experiencia:</label>
        <input
          type="number"
          name="years_experience"
          value={formData.years_experience}
          onChange={handleInputChange}
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label>Proyectos Liderados:</label>
        <input
          type="number"
          name="projects_led"
          value={formData.projects_led}
          onChange={handleInputChange}
          min="0"
          required
        />
      </div>
    </>
  );
};

export default LeaderFields;
