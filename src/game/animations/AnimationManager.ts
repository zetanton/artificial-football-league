import { Formation, PlayType, PlayerMovement } from '../../types/game';
import { PlayAnimations } from './PlayAnimations';

export class AnimationManager {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private animationFrame: number | null = null;
  private animations: PlayerMovement[] = [];
  private startTime: number = 0;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public async animate(playType: PlayType, formation: Formation, ballPosition: number, success: boolean): Promise<void> {
    this.animations = PlayAnimations.getPlayAnimation(playType, formation, ballPosition, success);
    this.startTime = performance.now();
    return this.runAnimation();
  }

  private async runAnimation(): Promise<void> {
    return new Promise((resolve) => {
      const animate = (currentTime: number) => {
        const elapsed = currentTime - this.startTime;
        let allComplete = true;

        // Clear previous frame
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw each animation
        this.animations.forEach(movement => {
          const progress = Math.min(1, Math.max(0, (elapsed - movement.delay) / movement.duration));
          
          if (progress < 1) {
            allComplete = false;
          }

          if (progress > 0) {
            // Calculate current position using quadratic bezier curve
            const t = progress;
            const x = Math.pow(1 - t, 2) * movement.startX + 
                     2 * (1 - t) * t * movement.controlX + 
                     Math.pow(t, 2) * movement.endX;
            
            const y = Math.pow(1 - t, 2) * movement.startY + 
                     2 * (1 - t) * t * movement.controlY + 
                     Math.pow(t, 2) * movement.endY;

            // Draw player at current position
            this.drawPlayer(x, y);
          }
        });

        if (allComplete) {
          if (this.animationFrame !== null) {
            cancelAnimationFrame(this.animationFrame);
          }
          resolve();
        } else {
          this.animationFrame = requestAnimationFrame(animate);
        }
      };

      this.animationFrame = requestAnimationFrame(animate);
    });
  }

  private drawPlayer(x: number, y: number): void {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 5, 0, Math.PI * 2);
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fill();
    this.ctx.closePath();
  }

  public async playTouchdownAnimation(): Promise<void> {
    return new Promise((resolve) => {
      let opacity = 1;
      const animate = () => {
        this.ctx.fillStyle = `rgba(255, 215, 0, ${opacity})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        opacity -= 0.02;
        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      animate();
    });
  }

  public async playSafetyAnimation(): Promise<void> {
    return new Promise((resolve) => {
      let opacity = 1;
      const animate = () => {
        this.ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        opacity -= 0.02;
        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      animate();
    });
  }

  public stop(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
}