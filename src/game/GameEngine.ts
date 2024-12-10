import { GameState, Team, PlaybookPlay } from '../types/game';
import { StatsManager } from './managers/StatsManager';
import { GameStateManager } from './managers/GameStateManager';
import { PlayManager } from './managers/PlayManager';
import { AnimationManager } from './animations/AnimationManager';
import { calculateFieldPosition, isTouchdown, isSafety } from './utils/GameUtils';
import { calculatePuntDistance, calculateFieldGoalProbability } from './utils/SpecialTeamsUtils';

export class GameEngine {
  private gameStateManager: GameStateManager;
  private statsManager: StatsManager;
  private playManager: PlayManager;
  private animationManager?: AnimationManager;
  private gameEnded: boolean = false;

  constructor(homeTeam: Team, awayTeam: Team, firstPossession: 'home' | 'away') {
    this.gameStateManager = new GameStateManager(homeTeam, awayTeam, firstPossession);
    this.statsManager = new StatsManager(homeTeam, awayTeam);
    this.playManager = new PlayManager();
  }

  public getGameState(): GameState {
    return this.gameStateManager.getState();
  }

  public async executePlay(play: PlaybookPlay): Promise<void> {
    if (this.gameEnded || this.getGameState().quarter > 4) {
      return;
    }

    const gameState = this.getGameState();
    const offenseTeam = gameState.possession === 'home' ? gameState.homeTeam : gameState.awayTeam;
    const defenseTeam = gameState.possession === 'home' ? gameState.awayTeam : gameState.homeTeam;

    this.gameStateManager.updateState({ playState: 'in-play' });

    let result;
    switch (play.type) {
      case 'run':
      case 'pass':
        result = this.playManager.executePlay(play, offenseTeam, defenseTeam);
        await this.handleOffensiveResult(result, play);
        break;
      case 'punt':
        await this.handlePunt(offenseTeam);
        break;
      case 'fieldGoal':
        await this.handleFieldGoal(offenseTeam);
        break;
      case 'defense':
        const cpuPlay = this.selectCPUOffensivePlay();
        result = this.playManager.executePlay(cpuPlay, defenseTeam, offenseTeam);
        await this.handleOffensiveResult(result, cpuPlay);
        break;
    }

    this.updateGameClock();
    this.checkQuarterEnd();
    this.gameStateManager.updateState({ playState: 'pre-snap' });
  }

  private async handleOffensiveResult(
    result: { success: boolean; yards: number; turnover: boolean; description: string },
    play: PlaybookPlay
  ): Promise<void> {
    const gameState = this.getGameState();
    const direction = gameState.direction[gameState.possession];
    const adjustedYards = direction === 'right' ? result.yards : -result.yards;
    const newPosition = calculateFieldPosition(
      gameState.ballPosition,
      adjustedYards,
      gameState.possession
    );

    if (result.turnover) {
      await this.handleTurnover();
      return;
    }

    if (isTouchdown(newPosition, gameState.possession)) {
      await this.handleTouchdown();
      return;
    }

    if (isSafety(newPosition, gameState.possession)) {
      await this.handleSafety();
      return;
    }

    // Update stats and game state
    this.statsManager.updateStats(
      gameState.possession === 'home' ? gameState.homeTeam.id : gameState.awayTeam.id,
      play.type,
      result.yards,
      result.success
    );

    this.gameStateManager.updateState({
      ballPosition: newPosition,
      lastPlay: {
        type: play.type,
        yards: result.yards,
        result: result.description
      }
    });

    this.gameStateManager.updateDownAndDistance(Math.abs(adjustedYards));
  }

  private async handlePunt(team: Team): Promise<void> {
    const gameState = this.getGameState();
    const puntDistance = calculatePuntDistance(team.stats.specialTeams, 'clear', gameState.ballPosition);
    const returnYards = Math.floor(Math.random() * 10);
    const netYards = gameState.direction[gameState.possession] === 'right' ? 
      puntDistance - returnYards : 
      -(puntDistance - returnYards);

    const newPosition = calculateFieldPosition(
      gameState.ballPosition,
      netYards,
      gameState.possession
    );

    this.gameStateManager.updateState({
      ballPosition: newPosition,
      lastPlay: {
        type: 'punt',
        yards: puntDistance,
        result: `Punt ${puntDistance} yards, returned for ${returnYards} yards`
      }
    });

    this.gameStateManager.switchPossession();
  }

  private async handleFieldGoal(team: Team): Promise<void> {
    const gameState = this.getGameState();
    const distance = Math.abs(gameState.ballPosition - (gameState.possession === 'home' ? 100 : 0)) + 17;
    const probability = calculateFieldGoalProbability(distance, team.stats.specialTeams, 'clear');
    const success = Math.random() * 100 < probability;

    if (success) {
      this.gameStateManager.updateScore(gameState.possession, 3);
      this.gameStateManager.updateState({
        ballPosition: 20,
        lastPlay: {
          type: 'fieldGoal',
          yards: distance,
          result: `Field goal good from ${distance} yards!`
        }
      });
      this.gameStateManager.switchPossession();
    } else {
      this.gameStateManager.updateState({
        lastPlay: {
          type: 'fieldGoal',
          yards: distance,
          result: `Field goal missed from ${distance} yards`
        }
      });
      this.gameStateManager.switchPossession();
    }
  }

  private async handleTouchdown(): Promise<void> {
    const gameState = this.getGameState();
    this.gameStateManager.updateScore(gameState.possession, 6);
    this.statsManager.addTouchdown(
      gameState.possession === 'home' ? gameState.homeTeam.id : gameState.awayTeam.id
    );

    // Reset for extra point
    this.gameStateManager.updateState({
      ballPosition: 97,
      down: 1,
      yardsToGo: 3,
      lastPlay: {
        type: 'touchdown',
        yards: 0,
        result: 'Touchdown!'
      }
    });
  }

  private async handleSafety(): Promise<void> {
    const gameState = this.getGameState();
    this.gameStateManager.updateScore(
      gameState.possession === 'home' ? 'away' : 'home',
      2
    );

    this.gameStateManager.updateState({
      ballPosition: 20,
      down: 1,
      yardsToGo: 10,
      lastPlay: {
        type: 'safety',
        yards: 0,
        result: 'Safety!'
      }
    });

    this.gameStateManager.switchPossession();
  }

  private async handleTurnover(): Promise<void> {
    const gameState = this.getGameState();
    this.statsManager.addTurnover(
      gameState.possession === 'home' ? gameState.homeTeam.id : gameState.awayTeam.id
    );

    this.gameStateManager.updateState({
      down: 1,
      yardsToGo: 10,
      lastPlay: {
        type: 'turnover',
        yards: 0,
        result: 'Turnover!'
      }
    });

    this.gameStateManager.switchPossession();
  }

  private selectCPUOffensivePlay(): PlaybookPlay {
    const gameState = this.getGameState();
    // Simple AI for CPU play selection
    if (gameState.down === 4) {
      return {
        id: 'punt',
        name: 'Punt',
        type: 'punt',
        formation: 'Punt',
        successRate: 95,
        minYards: 35,
        maxYards: 55
      };
    }

    // Pass more on long yardage
    if (gameState.yardsToGo > 7) {
      return {
        id: 'pass',
        name: 'Pass Play',
        type: 'pass',
        formation: 'Shotgun',
        successRate: 60,
        minYards: 5,
        maxYards: 15
      };
    }

    // Run more on short yardage
    return {
      id: 'run',
      name: 'Run Play',
      type: 'run',
      formation: 'I-Formation',
      successRate: 70,
      minYards: 2,
      maxYards: 8
    };
  }

  private updateGameClock(): void {
    const gameState = this.getGameState();
    const timeToRun = Math.floor(Math.random() * 20) + 25; // 25-45 seconds per play
    const newTime = Math.max(0, gameState.timeRemaining - timeToRun);
    this.gameStateManager.updateState({ timeRemaining: newTime });
  }

  private checkQuarterEnd(): void {
    if (!this.gameStateManager.updateQuarter()) {
      this.gameEnded = true;
    }
  }
}