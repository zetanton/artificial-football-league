import { GameState, Team } from '../../types/game';

export class GameStateManager {
  private gameState: GameState;

  constructor(homeTeam: Team, awayTeam: Team, firstPossession: 'home' | 'away') {
    this.gameState = {
      possession: firstPossession,
      down: 1,
      yardsToGo: 10,
      ballPosition: 20, // Start at own 20
      quarter: 1,
      timeRemaining: 900,
      score: { home: 0, away: 0 },
      homeTeam,
      awayTeam,
      lastPlay: null,
      playState: 'pre-snap',
      specialTeams: false,
      direction: {
        home: firstPossession === 'home' ? 'right' : 'left',
        away: firstPossession === 'home' ? 'left' : 'right'
      }
    };
  }

  public getState(): GameState {
    return { ...this.gameState };
  }

  public updateState(updates: Partial<GameState>): void {
    this.gameState = { ...this.gameState, ...updates };
  }

  public switchPossession(): void {
    this.gameState.possession = this.gameState.possession === 'home' ? 'away' : 'home';
    this.gameState.down = 1;
    this.gameState.yardsToGo = 10;
    
    // Adjust ball position for touchback if needed
    if (this.gameState.ballPosition <= 0 || this.gameState.ballPosition >= 100) {
      this.gameState.ballPosition = 20;
    }
  }

  public updateDownAndDistance(yards: number): void {
    const yardsGained = yards;
    this.gameState.yardsToGo -= yardsGained;

    if (this.gameState.yardsToGo <= 0) {
      // First down achieved
      this.gameState.down = 1;
      this.gameState.yardsToGo = 10;
    } else if (this.gameState.down === 4) {
      // Turnover on downs
      this.switchPossession();
    } else {
      this.gameState.down++;
    }
  }

  public updateScore(team: 'home' | 'away', points: number): void {
    this.gameState.score[team] += points;
  }

  public updateQuarter(): boolean {
    if (this.gameState.timeRemaining <= 0) {
      if (this.gameState.quarter < 4) {
        this.gameState.quarter++;
        this.gameState.timeRemaining = 900;
        
        // Switch field direction at halftime
        if (this.gameState.quarter === 3) {
          this.gameState.direction = {
            home: this.gameState.direction.home === 'right' ? 'left' : 'right',
            away: this.gameState.direction.away === 'right' ? 'left' : 'right'
          };
        }
        return true;
      }
      return false;
    }
    return true;
  }
}