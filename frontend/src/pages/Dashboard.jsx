import React, { useState, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { useAuth } from '../context/AuthContext.jsx';
import { employeeService } from '../services/employeeService.js';
import { teamService } from '../services/teamService.js';
import Employees from './Employees.jsx';
import Teams from './Teams.jsx';
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx';
import DashboardTabs from '../components/dashboard/DashboardTabs.jsx';
import DashboardStats from '../components/dashboard/DashboardStats.jsx';

const Dashboard = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState({ employees: 0, teams: 0 });

  const handleLogout = () => {
    logout();
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // Fetch general statistics
  useEffect(() => {
    (async () => {
      try {
        const emps = await employeeService.getEmployees();
        const tms = await teamService.getTeams();
        setStats({ employees: emps.length, teams: tms.length });
      } catch (e) {
        console.error('Error loading stats:', e);
      }
    })();
  }, []);


  // Main render
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <DashboardHeader username={user?.username} onLogout={handleLogout} />
      <DashboardTabs tab={tab} onTabChange={handleTabChange} />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {tab === 0 && <DashboardStats stats={stats} />}
        {tab === 1 && <Employees />}
        {tab === 2 && <Teams />}
      </Box>
    </Box>
  );
};

export default Dashboard;