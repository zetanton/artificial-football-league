import { Formation } from '../../types/game';
import { FormationManager } from '../formations/FormationManager';

interface PlayerSprite {
  x: number;
  y: number;
  color: string;
  role: 'offense' | 'defense';
  position: string;
  direction: number;
  isAnimating?: boolean;
  targetX?: number;
  targetY?: number;
  animationProgress?: number;
  isRunning: boolean;
  animationFrame: number;
}

export class PlayerRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private players: PlayerSprite[] = [];
  private formationManager: FormationManager;
  private frameCount: number = 0;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.formationManager = new FormationManager();
  }

  public renderPlayers(formation: Formation, ballPosition: number): void {
    this.frameCount = (this.frameCount + 1) % 30; // Animation cycle
    const baseX = (ballPosition / 100) * this.width;
    const baseY = this.height / 2;

    // Get formation positions
    const positions = this.formationManager.getFormationPositions(formation, baseX, baseY);

    // Create player sprites
    this.players = positions.map(pos => ({
      x: pos.x,
      y: pos.y,
      color: '#FF0000', // Offense color
      role: 'offense',
      position: pos.position,
      direction: 0,
      isRunning: true,
      animationFrame: Math.floor(this.frameCount / 10)
    }));

    // Add defensive players
    const defensePositions = this.getDefensivePositions(formation, baseX, baseY);
    this.players.push(...defensePositions.map(pos => ({
      x: pos.x,
      y: pos.y,
      color: '#0000FF', // Defense color
      role: 'defense',
      position: 'D',
      direction: Math.PI,
      isRunning: true,
      animationFrame: Math.floor(this.frameCount / 10)
    })));

    // Render all players
    this.players.forEach(player => this.drawTecmoPlayer(player));
  }

  private drawTecmoPlayer(player: PlayerSprite): void {
    const x = player.isAnimating && player.targetX !== undefined
      ? player.x + (player.targetX - player.x) * (player.animationProgress || 0)
      : player.x;
    const y = player.isAnimating && player.targetY !== undefined
      ? player.y + (player.targetY - player.y) * (player.animationProgress || 0)
      : player.y;

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(player.direction);

    const scale = 1.5; // Larger scale for better visibility
    const legOffset = player.isRunning ? Math.sin(player.animationFrame * Math.PI) * 4 : 0;

    // Draw shadow
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(-8 * scale, 8 * scale, 16 * scale, 4 * scale);

    // Draw legs
    this.ctx.fillStyle = '#000000';
    // Left leg
    this.ctx.fillRect(-6 * scale, 2 * scale, 4 * scale, 8 * scale + legOffset);
    // Right leg
    this.ctx.fillRect(2 * scale, 2 * scale, 4 * scale, 8 * scale - legOffset);
    
    // Draw shoes
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(-7 * scale, (10 + legOffset) * scale, 5 * scale, 3 * scale);
    this.ctx.fillRect(2 * scale, (10 - legOffset) * scale, 5 * scale, 3 * scale);

    // Draw jersey (body)
    this.ctx.fillStyle = player.color;
    this.ctx.fillRect(-8 * scale, -8 * scale, 16 * scale, 10 * scale);

    // Draw number on jersey
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = `bold ${8 * scale}px "Courier New"`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(player.position, 0, -2 * scale);

    // Draw helmet
    this.ctx.fillStyle = player.color;
    this.ctx.beginPath();
    this.ctx.ellipse(0, -10 * scale, 7 * scale, 6 * scale, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw facemask
    this.ctx.strokeStyle = '#CCCCCC';
    this.ctx.lineWidth = 2 * scale;
    this.ctx.beginPath();
    this.ctx.moveTo(-4 * scale, -10 * scale);
    this.ctx.lineTo(4 * scale, -10 * scale);
    this.ctx.stroke();

    // Draw arms
    this.ctx.fillStyle = player.color;
    // Left arm
    this.ctx.fillRect(-10 * scale, -6 * scale, 4 * scale, 8 * scale);
    // Right arm
    this.ctx.fillRect(6 * scale, -6 * scale, 4 * scale, 8 * scale);

    this.ctx.restore();
  }

  private getDefensivePositions(formation: Formation, baseX: number, baseY: number): { x: number; y: number }[] {
    const positions: { x: number; y: number }[] = [];
    const defenseSpacing = 20;

    // Add defensive line
    for (let i = -2; i <= 2; i++) {
      positions.push({
        x: baseX + 30,
        y: baseY + (i * defenseSpacing)
      });
    }

    // Add linebackers
    for (let i = -1; i <= 1; i++) {
      positions.push({
        x: baseX + 50,
        y: baseY + (i * defenseSpacing * 1.5)
      });
    }

    // Add defensive backs
    for (let i = -2; i <= 2; i++) {
      positions.push({
        x: baseX + 70,
        y: baseY + (i * defenseSpacing * 1.5)
      });
    }

    return positions;
  }

  private updateAnimations(): void {
    this.players.forEach(player => {
      if (player.isAnimating && player.animationProgress !== undefined) {
        player.animationProgress = Math.min(1, player.animationProgress + 0.05);
        if (player.animationProgress >= 1) {
          player.isAnimating = false;
        }
      }
    });
  }
}