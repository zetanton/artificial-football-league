// Add direction to GameState
export interface GameState {
  possession: 'home' | 'away';
  down: number;
  yardsToGo: number;
  ballPosition: number;
  quarter: number;
  timeRemaining: number;
  score: { home: number; away: number };
  homeTeam: Team;
  awayTeam: Team;
  lastPlay: {
    type: string;
    yards: number;
    result: string;
    description?: string;
  } | null;
  currentFormation?: Formation;
  playState: 'pre-snap' | 'in-play' | 'post-play';
  specialTeams: boolean;
  direction: { home: 'left' | 'right'; away: 'left' | 'right' };
  playResult?: {
    text: string;
    type: 'success' | 'failure' | 'turnover' | 'score';
  };
}