import React from 'react';
import { Box } from '@mui/material';
import EmployeeCard from './EmployeeCard';

const EmployeesList = ({ employees, getEmployeeDetails, onEdit, onDelete }) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
      {employees.map(employee => {
        const employeeDetails = getEmployeeDetails(employee);
        return (
          <EmployeeCard 
            key={employee.id}
            employee={employee}
            employeeDetails={employeeDetails}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </Box>
  );
};

export default EmployeesList;
