import React from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';

const EmployeeCard = ({ employee, employeeDetails, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{employee.name}</Typography>
        <Typography variant="body2"><strong>Cédula:</strong> {employee.identity_card}</Typography>
        <Typography variant="body2"><strong>Edad:</strong> {employee.age} años</Typography>
        <Typography variant="body2"><strong>Sexo:</strong> {employee.sex === 'M' ? 'Masculino' : 'Femenino'}</Typography>
        <Typography variant="body2"><strong>Salario:</strong> ${employee.base_salary}</Typography>
        <Typography variant="body2"><strong>Tipo:</strong> {employee.type === 'programmer' ? 'Programador' : 'Líder'}</Typography>
          
        {/* Mostrar campos específicos */}
        {employee.type === 'programmer' ? (
          <>
            <Typography variant="body2"><strong>Categoría:</strong> {employeeDetails.category}</Typography>
            <Typography variant="body2"><strong>Lenguajes:</strong> {employeeDetails.languages.join(', ') || 'Ninguno'}</Typography>
          </>
        ) : (
          <>
            <Typography variant="body2"><strong>Experiencia:</strong> {employeeDetails.years_experience} años</Typography>
            <Typography variant="body2"><strong>Proyectos:</strong> {employeeDetails.projects_led}</Typography>
          </>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onEdit(employee)}>Editar</Button>
        <Button size="small" color="error" onClick={() => onDelete(employee)}>Eliminar</Button>
      </CardActions>
    </Card>
  );
};

export default EmployeeCard;
