import React from 'react';
import { Tabs, Tab } from '@mui/material';

const DashboardTabs = ({ tab, onTabChange }) => {
  return (
    <Tabs
      value={tab}
      onChange={onTabChange}
      variant="fullWidth"
      textColor="inherit"
      indicatorColor="secondary"
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Tab label="Dashboard" />
      <Tab label="Empleados" />
      <Tab label="Equipos" />
      <Tab label="Proyectos" />
    </Tabs>
  );
};

export default DashboardTabs;
