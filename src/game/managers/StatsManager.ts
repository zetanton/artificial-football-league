export class StatsManager {
  private stats: {
    [teamId: string]: {
      rushingYards: number;
      passingYards: number;
      completions: number;
      attempts: number;
      touchdowns: number;
      turnovers: number;
    }
  };

  constructor(homeTeam: { id: string }, awayTeam: { id: string }) {
    this.stats = {
      [homeTeam.id]: {
        rushingYards: 0,
        passingYards: 0,
        completions: 0,
        attempts: 0,
        touchdowns: 0,
        turnovers: 0
      },
      [awayTeam.id]: {
        rushingYards: 0,
        passingYards: 0,
        completions: 0,
        attempts: 0,
        touchdowns: 0,
        turnovers: 0
      }
    };
  }

  public updateStats(teamId: string, playType: string, yards: number, success: boolean): void {
    if (playType === 'run') {
      this.stats[teamId].rushingYards += yards;
    } else if (playType === 'pass') {
      this.stats[teamId].passingYards += yards;
      this.stats[teamId].attempts++;
      if (success) {
        this.stats[teamId].completions++;
      }
    }
  }

  public addTouchdown(teamId: string): void {
    this.stats[teamId].touchdowns++;
  }

  public addTurnover(teamId: string): void {
    this.stats[teamId].turnovers++;
  }

  public getStats(): typeof this.stats {
    return { ...this.stats };
  }
}