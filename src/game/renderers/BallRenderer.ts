export class BallRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public render(ballPosition: number): void {
    const ballX = (ballPosition / 100) * this.width;
    const ballY = this.height / 2;

    this.ctx.fillStyle = '#964B00';
    this.ctx.beginPath();
    this.ctx.ellipse(ballX, ballY, 10, 6, 0, 0, 2 * Math.PI);
    this.ctx.fill();
  }
}