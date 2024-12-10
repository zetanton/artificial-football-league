export class PlayClock {
  private timeRemaining: number;
  private isRunning: boolean = false;

  constructor() {
    this.timeRemaining = 40; // Standard play clock
  }

  public start(): void {
    this.isRunning = true;
    this.timeRemaining = 40;
  }

  public stop(): void {
    this.isRunning = false;
  }

  public reset(twoMinuteWarning: boolean = false): void {
    this.timeRemaining = twoMinuteWarning ? 25 : 40;
  }

  public tick(): void {
    if (this.isRunning && this.timeRemaining > 0) {
      this.timeRemaining--;
    }
  }

  public getTimeRemaining(): number {
    return this.timeRemaining;
  }

  public isDelayOfGame(): boolean {
    return this.timeRemaining === 0;
  }
}