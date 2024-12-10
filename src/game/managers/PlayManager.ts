import { PlaybookPlay, Team } from '../../types/game';
import { calculateSuccessRate } from '../utils/GameUtils';

export class PlayManager {
  public executePlay(
    play: PlaybookPlay,
    offenseTeam: Team,
    defenseTeam: Team,
    weather: string = 'clear'
  ): {
    success: boolean;
    yards: number;
    turnover: boolean;
    description: string;
  } {
    // Adjust success rate based on down and distance
    let adjustedSuccessRate = play.successRate;
    if (play.type === 'pass' && Math.random() < 0.15) {
      // Increased interception chance on passes
      return {
        success: false,
        yards: 0,
        turnover: true,
        description: 'Pass intercepted!'
      };
    }

    const successRate = calculateSuccessRate({
      offensePower: offenseTeam.stats.offense,
      defensePower: defenseTeam.stats.defense,
      baseSuccessRate: adjustedSuccessRate,
      weather: weather as any
    });

    const success = Math.random() * 100 < successRate;
    const turnover = !success && Math.random() < 0.1; // 10% turnover chance on failed plays
    
    let yards = 0;
    if (success) {
      // Calculate base yards
      yards = Math.floor(
        Math.random() * (play.maxYards - play.minYards)
      ) + play.minYards;

      // Big play chance (15% chance for significant gain)
      if (Math.random() < 0.15) {
        yards = Math.floor(yards * 1.8);
      }
    } else {
      // Failed plays
      if (play.type === 'pass') {
        yards = 0; // Incomplete pass
      } else {
        yards = Math.floor(Math.random() * 3) - 2; // Run for -2 to 0 yards
      }
    }

    // Adjust yards based on field position to prevent unrealistic gains
    const maxPossibleYards = 100;
    yards = Math.min(yards, maxPossibleYards);

    return {
      success,
      yards,
      turnover,
      description: this.generatePlayDescription(play, yards, success, turnover)
    };
  }

  private generatePlayDescription(
    play: PlaybookPlay,
    yards: number,
    success: boolean,
    turnover: boolean
  ): string {
    if (turnover) {
      return play.type === 'pass' ? 
        'Pass intercepted!' : 
        'Fumble!';
    }

    if (!success) {
      return play.type === 'pass' ? 
        'Incomplete pass' : 
        `Run stopped for ${yards} yards`;
    }

    const playType = play.type === 'pass' ? 'Pass complete' : 'Run';
    const yardText = yards === 0 ? 'no gain' : 
                    yards < 0 ? `loss of ${-yards}` :
                    `gain of ${yards}`;
    
    return `${playType} for ${yardText}`;
  }
}