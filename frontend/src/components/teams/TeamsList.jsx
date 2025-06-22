import React from 'react';
import { Box } from '@mui/material';
import TeamCard from './TeamCard';

const TeamsList = ({ teams, getTeamLeaderName, onViewMembers, onEdit, onDelete }) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
      {teams.map((team, index) => (
        <TeamCard 
          key={`team-${team.id}-${index}`}
          team={team}
          teamLeaderName={getTeamLeaderName(team)}
          onViewMembers={onViewMembers}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
};

export default TeamsList;
