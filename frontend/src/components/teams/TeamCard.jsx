import React from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';

const TeamCard = ({ team, teamLeaderName, onViewMembers, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{team.name}</Typography>
        <Typography variant="body2"><strong>Líder:</strong> {teamLeaderName}</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => onViewMembers(team)}>Ver Miembros</Button>
        <Button onClick={() => onEdit(team)}>Editar</Button>
        <Button color="error" onClick={() => onDelete(team)}>Eliminar</Button>
      </CardActions>
    </Card>
  );
};

export default TeamCard;
