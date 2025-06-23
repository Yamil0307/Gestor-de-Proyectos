import React, { useState, useEffect } from 'react';
import { Box, useTheme, Container, Typography, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext.jsx';
import { employeeService } from '../services/employeeService.js';
import { teamService } from '../services/teamService.js';
import { projectService } from '../services/projectService.js';
import Employees from './Employees.jsx';
import Teams from './Teams.jsx';
import Projects from './Projects.jsx';
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx';
import DashboardTabs from '../components/dashboard/DashboardTabs.jsx';
import DashboardStats from '../components/dashboard/DashboardStats.jsx';
import ProjectsChart from '../components/dashboard/ProjectsChart.jsx';
import NextProjectCard from '../components/dashboard/NextProjectCard.jsx';
import FinancialStats from '../components/dashboard/FinancialStats.jsx';

const Dashboard = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState({ employees: 0, teams: 0, projects: 0 });
  const [projectStats, setProjectStats] = useState({
    lastWeek: 0,
    lastMonth: 0,
    total: 0
  });
  const [earliestProject, setEarliestProject] = useState(null);
  const [totalSalary, setTotalSalary] = useState(0);
  const [highestPaidEmployees, setHighestPaidEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    
    if (newValue === 0) {
      fetchStats();
    }
  };

  // Función para calcular proyectos por período
  const calculateProjectsByPeriod = (projects) => {
    if (!projects || !Array.isArray(projects)) return { lastWeek: 0, lastMonth: 0, total: 0 };
    
    try {
      const now = new Date();
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 1);
      
      // Filtrar proyectos por período
      const lastWeekProjects = projects.filter(project => {
        if (!project || (!project.end_date && !project.start_date)) return false;
        
        // Usar fecha de fin si está disponible, sino fecha de inicio
        const dateToUse = project.end_date || project.start_date;
        try {
          const projectDate = new Date(dateToUse);
          if (isNaN(projectDate.getTime())) return false;
          return projectDate >= oneWeekAgo && projectDate <= now;
        } catch (e) {
          return false;
        }
      });
      
      const lastMonthProjects = projects.filter(project => {
        if (!project || (!project.end_date && !project.start_date)) return false;
        
        const dateToUse = project.end_date || project.start_date;
        try {
          const projectDate = new Date(dateToUse);
          if (isNaN(projectDate.getTime())) return false;
          return projectDate >= oneMonthAgo && projectDate <= now;
        } catch (e) {
          return false;
        }
      });
      
      return {
        lastWeek: lastWeekProjects.length,
        lastMonth: lastMonthProjects.length,
        total: projects.length
      };
    } catch (e) {
      console.error("Error al calcular estadísticas de proyectos:", e);
      return { lastWeek: 0, lastMonth: 0, total: projects?.length || 0 };
    }
  };

  // Función para cargar las estadísticas
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener estadísticas básicas
      let emps = [], tms = [], prjs = [];
      
      try {
        emps = await employeeService.getEmployees();
      } catch (e) {
        console.error('Error al cargar empleados:', e);
        emps = [];
      }
      
      try {
        tms = await teamService.getTeams();
      } catch (e) {
        console.error('Error al cargar equipos:', e);
        tms = [];
      }
      
      try {
        prjs = await projectService.getProjects();
      } catch (e) {
        console.error('Error al cargar proyectos:', e);
        prjs = [];
      }
      
      // Actualizar estadísticas generales
      setStats({ 
        employees: Array.isArray(emps) ? emps.length : 0, 
        teams: Array.isArray(tms) ? tms.length : 0, 
        projects: Array.isArray(prjs) ? prjs.length : 0
      });
      
      // Calcular estadísticas de proyectos
      if (Array.isArray(prjs)) {
        const projectPeriodStats = calculateProjectsByPeriod(prjs);
        setProjectStats(projectPeriodStats);
      }
      
      // Obtener el proyecto más próximo a terminar
      try {
        const earliest = await projectService.getEarliestProject();
        setEarliestProject(earliest || null);
      } catch (e) {
        console.error('Error al cargar el proyecto más próximo:', e);
        setEarliestProject(null);
      }
      
      // Obtener estadísticas financieras
      try {
        console.log('Obteniendo estadísticas financieras...'); // Para depuración
        
        // Obtener los empleados mejor pagados primero
        const topEmployees = await employeeService.getHighestPaidEmployees();
        console.log('Top empleados obtenidos:', topEmployees);
        setHighestPaidEmployees(Array.isArray(topEmployees) ? topEmployees : []);
        
        // Luego obtener la nómina total
        const totalMonthlySalary = await employeeService.getTotalMonthlySalary();
        console.log('Total nómina mensual:', totalMonthlySalary);
        setTotalSalary(totalMonthlySalary || 0);
      } catch (e) {
        console.error('Error al cargar estadísticas financieras:', e);
        setTotalSalary(0);
        setHighestPaidEmployees([]);
      }
      
    } catch (e) {
      console.error('Error general al cargar estadísticas:', e);
      setError('Error al cargar las estadísticas del dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial de estadísticas
  useEffect(() => {
    fetchStats();
  }, []);

  // Main render
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <DashboardHeader username={user?.username} onLogout={handleLogout} />
      <DashboardTabs tab={tab} onTabChange={handleTabChange} />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {tab === 0 && (
          <Container maxWidth="sm">
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Cargando estadísticas...
                </Typography>
              </Box>
            ) : error ? (
              <Box sx={{ mt: 5, textAlign: 'center' }}>
                <Typography color="error" variant="body1">
                  {error}
                </Typography>
                <Button variant="outlined" sx={{ mt: 2 }} onClick={fetchStats}>
                  Reintentar
                </Button>
              </Box>
            ) : (
              <>
                <DashboardStats stats={stats} />
                <NextProjectCard project={earliestProject} />
                <FinancialStats 
                  totalSalary={totalSalary || 0} 
                  highestPaidEmployees={highestPaidEmployees || []} 
                />
                <ProjectsChart projectStats={projectStats} />
              </>
            )}
          </Container>
        )}
        {tab === 1 && <Employees onDataChange={fetchStats} />}
        {tab === 2 && <Teams onDataChange={fetchStats} />}
        {tab === 3 && <Projects onDataChange={fetchStats} />}
      </Box>
    </Box>
  );
};

export default Dashboard;