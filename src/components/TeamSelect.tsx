import React from 'react';
import { Team } from '../types/game';
import { teams } from '../data/teams';

interface TeamSelectProps {
  onSelect: (team: Team) => void;
  conference: 'AFC' | 'NFC';
  excludeTeamId?: string;
}

const TeamSelect: React.FC<TeamSelectProps> = ({ onSelect, conference, excludeTeamId }) => {
  const conferenceTeams = teams.filter(
    team => team.conference === conference && team.id !== excludeTeamId
  );

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">{conference} Teams</h3>
      <div className="grid grid-cols-2 gap-4">
        {conferenceTeams.map(team => (
          <button
            key={team.id}
            onClick={() => onSelect(team)}
            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left"
          >
            <div className="font-bold">{team.city}</div>
            <div className="text-gray-300">{team.name}</div>
            <div className="mt-2 text-sm">
              <div>OFF: {team.stats.offense}</div>
              <div>DEF: {team.stats.defense}</div>
              <div>ST: {team.stats.specialTeams}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TeamSelect;