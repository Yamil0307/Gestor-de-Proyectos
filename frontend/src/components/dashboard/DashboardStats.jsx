import React from 'react';
import { Box, Card, CardContent, Typography, Container } from '@mui/material';
import { People as PeopleIcon, Groups as GroupsIcon } from '@mui/icons-material';

const DashboardStats = ({ stats }) => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        <Card sx={{ borderRadius: 0, textAlign: 'center' }}>
          <CardContent>
            <PeopleIcon fontSize="large" color="primary" />
            <Typography variant="h5">{stats.employees}</Typography>
            <Typography variant="body2">Empleados</Typography>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 0, textAlign: 'center' }}>
          <CardContent>
            <GroupsIcon fontSize="large" color="primary" />
            <Typography variant="h5">{stats.teams}</Typography>
            <Typography variant="body2">Equipos</Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default DashboardStats;
