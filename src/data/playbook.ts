import { PlaybookPlay, Formation } from '../types/game';

export const formations: Formation[] = [
  'I-Formation',
  'Shotgun',
  'Single Back',
  'Goal Line',
  'Punt',
  'Field Goal',
  '4-3',
  '3-4',
  'Prevent'
];

export const plays: PlaybookPlay[] = [
  // Running Plays
  {
    id: 'dive',
    name: 'HB Dive',
    type: 'run',
    formation: 'I-Formation',
    successRate: 70,
    minYards: 1,
    maxYards: 8
  },
  {
    id: 'sweep',
    name: 'HB Sweep',
    type: 'run',
    formation: 'I-Formation',
    successRate: 65,
    minYards: -2,
    maxYards: 15
  },
  {
    id: 'draw',
    name: 'Draw Play',
    type: 'run',
    formation: 'Shotgun',
    successRate: 60,
    minYards: -1,
    maxYards: 12
  },
  // Passing Plays
  {
    id: 'short',
    name: 'Short Pass',
    type: 'pass',
    formation: 'Shotgun',
    successRate: 75,
    minYards: 3,
    maxYards: 12
  },
  {
    id: 'deep',
    name: 'Deep Pass',
    type: 'pass',
    formation: 'Shotgun',
    successRate: 40,
    minYards: 15,
    maxYards: 40
  },
  {
    id: 'screen',
    name: 'Screen Pass',
    type: 'pass',
    formation: 'Single Back',
    successRate: 65,
    minYards: -2,
    maxYards: 20
  },
  // Special Teams
  {
    id: 'punt',
    name: 'Punt',
    type: 'punt',
    formation: 'Punt',
    successRate: 95,
    minYards: 35,
    maxYards: 55
  },
  {
    id: 'field-goal',
    name: 'Field Goal',
    type: 'fieldGoal',
    formation: 'Field Goal',
    successRate: 80,
    minYards: 0,
    maxYards: 0
  }
];

export const defensivePlays: PlaybookPlay[] = [
  {
    id: 'def-normal',
    name: 'Base 4-3',
    type: 'defense',
    formation: '4-3',
    successRate: 70,
    minYards: -2,
    maxYards: 5
  },
  {
    id: 'def-blitz',
    name: 'Blitz',
    type: 'defense',
    formation: '3-4',
    successRate: 60,
    minYards: -5,
    maxYards: 15
  },
  {
    id: 'def-prevent',
    name: 'Prevent',
    type: 'defense',
    formation: 'Prevent',
    successRate: 80,
    minYards: 0,
    maxYards: 8
  }
];