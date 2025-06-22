import React from 'react';

const ProgrammerFields = ({ formData, handleInputChange, handleLanguageChange, addLanguage, removeLanguage }) => {
  return (
    <>
      <div className="form-group">
        <label>Categoría:</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
        >
          <option value="A">Categoría A</option>
          <option value="B">Categoría B</option>
          <option value="C">Categoría C</option>
        </select>
      </div>

      <div className="form-group">
        <label>Lenguajes de Programación:</label>
        {formData.languages.map((language, index) => (
          <div key={index} className="language-input">
            <input
              type="text"
              value={language}
              onChange={(e) => handleLanguageChange(index, e.target.value)}
              placeholder="Ej: Python, JavaScript, Java"
            />
            {formData.languages.length > 1 && (
              <button
                type="button"
                onClick={() => removeLanguage(index)}
                className="remove-language"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addLanguage}
          className="add-language"
        >
          + Agregar Lenguaje
        </button>
      </div>
    </>
  );
};

export default ProgrammerFields;
