import { PlayerMovement, PlayType, Formation } from '../../types/game';

export class PlayAnimations {
  static getPlayAnimation(
    playType: PlayType,
    formation: Formation,
    ballPosition: number,
    success: boolean
  ): PlayerMovement[] {
    const baseY = 200; // Center of field
    const startX = (ballPosition / 100) * 800; // Scale to canvas width

    switch (playType) {
      case 'run':
        return this.getRunningAnimation(formation, startX, baseY, success);
      case 'pass':
        return this.getPassingAnimation(formation, startX, baseY, success);
      case 'punt':
        return this.getPuntAnimation(startX, baseY);
      case 'fieldGoal':
        return this.getFieldGoalAnimation(startX, baseY);
      default:
        return [];
    }
  }

  private static getRunningAnimation(
    formation: Formation,
    startX: number,
    baseY: number,
    success: boolean
  ): PlayerMovement[] {
    const movements: PlayerMovement[] = [];
    
    // Running back movement
    movements.push({
      startX: startX - 20,
      startY: baseY,
      controlX: startX,
      controlY: baseY + (success ? -20 : 20),
      endX: startX + (success ? 40 : 10),
      endY: baseY + (success ? -30 : 30),
      duration: 1000,
      delay: 0
    });

    // Blockers movements
    for (let i = -2; i <= 2; i++) {
      movements.push({
        startX: startX,
        startY: baseY + (i * 15),
        controlX: startX + 10,
        controlY: baseY + (i * 15),
        endX: startX + 20,
        endY: baseY + (i * 15),
        duration: 800,
        delay: 100
      });
    }

    return movements;
  }

  private static getPassingAnimation(
    formation: Formation,
    startX: number,
    baseY: number,
    success: boolean
  ): PlayerMovement[] {
    const movements: PlayerMovement[] = [];
    
    // QB movement
    movements.push({
      startX: startX - 40,
      startY: baseY,
      controlX: startX - 45,
      controlY: baseY - 10,
      endX: startX - 50,
      endY: baseY,
      duration: 500,
      delay: 0
    });

    // Receiver movements
    const receiverCount = formation === 'Shotgun' ? 3 : 2;
    for (let i = 0; i < receiverCount; i++) {
      const angle = (Math.PI / (receiverCount + 1)) * (i + 1);
      movements.push({
        startX: startX - 20,
        startY: baseY + (i * 20) - 20,
        controlX: startX + 20,
        controlY: baseY + Math.sin(angle) * 40,
        endX: startX + 60,
        endY: baseY + Math.sin(angle) * 60,
        duration: 1500,
        delay: 200
      });
    }

    return movements;
  }

  private static getPuntAnimation(startX: number, baseY: number): PlayerMovement[] {
    return [{
      startX: startX - 15,
      startY: baseY,
      controlX: startX + 100,
      controlY: baseY - 100,
      endX: startX + 200,
      endY: baseY,
      duration: 2000,
      delay: 0
    }];
  }

  private static getFieldGoalAnimation(startX: number, baseY: number): PlayerMovement[] {
    return [{
      startX: startX,
      startY: baseY,
      controlX: startX + 50,
      controlY: baseY - 80,
      endX: startX + 100,
      endY: baseY - 100,
      duration: 1500,
      delay: 0
    }];
  }
}