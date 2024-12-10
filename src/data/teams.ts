import { Team } from '../types/game';

export const teams: Team[] = [
  // AFC Conference
  {
    id: 'bos',
    name: 'Minutemen',
    city: 'Boston',
    conference: 'AFC',
    division: 'East',
    stats: { offense: 85, defense: 88, specialTeams: 82 }
  },
  {
    id: 'ny',
    name: 'Empire',
    city: 'New York',
    conference: 'AFC',
    division: 'East',
    stats: { offense: 89, defense: 85, specialTeams: 84 }
  },
  {
    id: 'mia',
    name: 'Sharks',
    city: 'Miami',
    conference: 'AFC',
    division: 'East',
    stats: { offense: 86, defense: 83, specialTeams: 85 }
  },
  {
    id: 'hou',
    name: 'Astronauts',
    city: 'Houston',
    conference: 'AFC',
    division: 'South',
    stats: { offense: 84, defense: 86, specialTeams: 83 }
  },
  // NFC Conference
  {
    id: 'sf',
    name: 'Miners',
    city: 'San Francisco',
    conference: 'NFC',
    division: 'West',
    stats: { offense: 92, defense: 91, specialTeams: 85 }
  },
  {
    id: 'tex',
    name: 'Rangers',
    city: 'Dallas',
    conference: 'NFC',
    division: 'East',
    stats: { offense: 88, defense: 87, specialTeams: 83 }
  },
  {
    id: 'chi',
    name: 'Wind',
    city: 'Chicago',
    conference: 'NFC',
    division: 'North',
    stats: { offense: 83, defense: 89, specialTeams: 82 }
  },
  {
    id: 'sea',
    name: 'Sailors',
    city: 'Seattle',
    conference: 'NFC',
    division: 'West',
    stats: { offense: 87, defense: 90, specialTeams: 86 }
  }
];