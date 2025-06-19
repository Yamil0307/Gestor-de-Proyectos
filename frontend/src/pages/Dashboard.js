import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Employees from './Employees';
import Teams from './Teams';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Renderizar vista según la selección actual
  if (currentView === 'employees') {
    return <Employees onBack={handleBackToDashboard} />;
  }

  if (currentView === 'teams') {
    return <Teams onBack={handleBackToDashboard} />;
  }

  // Vista principal del dashboard
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Sistema de Gestión de Proyectos</h1>
        <div className="user-info">
          <span>Bienvenido, {user?.username}</span>
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Empleados</h3>
            <p>Gestionar empleados del sistema</p>
            <button 
              className="card-button"
              onClick={() => handleViewChange('employees')}
            >
              Ver Empleados
            </button>
          </div>

          <div className="dashboard-card">
            <h3>Equipos</h3>
            <p>Administrar equipos de trabajo</p>
            <button 
              className="card-button"
              onClick={() => handleViewChange('teams')}
            >
              Ver Equipos
            </button>
          </div>

          <div className="dashboard-card">
            <h3>Proyectos</h3>
            <p>Controlar proyectos activos</p>
            <button 
              className="card-button"
              onClick={() => handleViewChange('projects')}
            >
              Ver Proyectos
            </button>
          </div>

          <div className="dashboard-card">
            <h3>Reportes</h3>
            <p>Análisis y estadísticas</p>
            <button 
              className="card-button"
              onClick={() => handleViewChange('analytics')}
            >
              Ver Reportes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;