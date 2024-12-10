import { Team, PlaybookPlay } from '../../types/game';

export interface GameStats {
  rushingYards: { [teamId: string]: number };
  passingYards: { [teamId: string]: number };
  completions: { [teamId: string]: number };
  attempts: { [teamId: string]: number };
  touchdowns: { [teamId: string]: number };
  turnovers: { [teamId: string]: number };
}

export class StatsManager {
  private stats: GameStats;

  constructor(homeTeam: Team, awayTeam: Team) {
    this.stats = {
      rushingYards: { [homeTeam.id]: 0, [awayTeam.id]: 0 },
      passingYards: { [homeTeam.id]: 0, [awayTeam.id]: 0 },
      completions: { [homeTeam.id]: 0, [awayTeam.id]: 0 },
      attempts: { [homeTeam.id]: 0, [awayTeam.id]: 0 },
      touchdowns: { [homeTeam.id]: 0, [awayTeam.id]: 0 },
      turnovers: { [homeTeam.id]: 0, [awayTeam.id]: 0 }
    };
  }

  public updateStats(teamId: string, play: PlaybookPlay, yards: number, success: boolean): void {
    if (play.type === 'run') {
      this.stats.rushingYards[teamId] += yards;
    } else {
      this.stats.passingYards[teamId] += yards;
      this.stats.attempts[teamId]++;
      if (success) {
        this.stats.completions[teamId]++;
      }
    }
  }

  public addTouchdown(teamId: string): void {
    this.stats.touchdowns[teamId]++;
  }

  public addTurnover(teamId: string): void {
    this.stats.turnovers[teamId]++;
  }

  public getStats(): GameStats {
    return { ...this.stats };
  }
}