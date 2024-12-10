export class FieldRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private yardWidth: number;
  private endZoneWidth: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.endZoneWidth = width * 0.1; // 10% of width for each endzone
    this.yardWidth = (width - (this.endZoneWidth * 2)) / 100; // Remaining space divided by 100 yards
  }

  public render(): void {
    this.drawField();
    this.drawEndZones();
    this.drawYardLines();
    this.drawHashMarks();
    this.drawYardNumbers();
    this.drawGoalPosts(); // Draw goalposts last so they appear in front
  }

  private drawField(): void {
    // Main field
    this.ctx.fillStyle = '#2E7D32';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private drawEndZones(): void {
    this.ctx.fillStyle = '#1B5E20';
    
    // Left endzone
    this.ctx.fillRect(0, 0, this.endZoneWidth, this.height);
    this.drawEndZoneText(this.endZoneWidth / 2, this.height / 2, -Math.PI / 2);
    
    // Right endzone
    this.ctx.fillRect(this.width - this.endZoneWidth, 0, this.endZoneWidth, this.height);
    this.drawEndZoneText(this.width - this.endZoneWidth / 2, this.height / 2, Math.PI / 2);
  }

  private drawEndZoneText(x: number, y: number, rotation: number): void {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = `${this.endZoneWidth * 0.4}px Arial Black`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('TOUCHDOWN', 0, 0);
    this.ctx.restore();
  }

  private drawYardLines(): void {
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    
    for (let yard = 0; yard <= 100; yard += 5) {
      const x = this.endZoneWidth + (yard * this.yardWidth);
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();

      if (yard % 10 === 0) {
        this.ctx.lineWidth = 4;
        this.ctx.stroke();
        this.ctx.lineWidth = 2;
      }
    }
  }

  private drawHashMarks(): void {
    const hashMarkHeight = this.height * 0.05;
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    
    for (let yard = 0; yard <= 100; yard++) {
      const x = this.endZoneWidth + (yard * this.yardWidth);
      
      // Top hash marks
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.height * 0.25 - hashMarkHeight / 2);
      this.ctx.lineTo(x, this.height * 0.25 + hashMarkHeight / 2);
      this.ctx.stroke();

      // Bottom hash marks
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.height * 0.75 - hashMarkHeight / 2);
      this.ctx.lineTo(x, this.height * 0.75 + hashMarkHeight / 2);
      this.ctx.stroke();
    }
  }

  private drawYardNumbers(): void {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = `${this.height * 0.05}px Arial`;
    this.ctx.textAlign = 'center';
    
    for (let yard = 10; yard <= 90; yard += 10) {
      const x = this.endZoneWidth + (yard * this.yardWidth);
      const number = yard;
      const reverseNumber = 100 - yard;
      
      // Top numbers
      this.ctx.save();
      this.ctx.translate(x, this.height * 0.15);
      this.ctx.rotate(Math.PI);
      this.ctx.fillText(reverseNumber.toString(), 0, 0);
      this.ctx.restore();
      
      // Bottom numbers
      this.ctx.fillText(number.toString(), x, this.height * 0.9);
    }
  }

  private drawGoalPosts(): void {
    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 4;
    
    // Left goalpost (behind endzone)
    this.drawGoalPost(-this.endZoneWidth * 0.2);
    
    // Right goalpost (behind endzone)
    this.drawGoalPost(this.width + this.endZoneWidth * 0.2);
  }

  private drawGoalPost(x: number): void {
    const postWidth = this.height * 0.15; // Width of the Y shape
    const centerY = this.height / 2;
    
    // Draw the Y shape from a top-down perspective
    this.ctx.beginPath();
    
    // Base of the Y
    this.ctx.moveTo(x, centerY - postWidth / 2);
    this.ctx.lineTo(x, centerY + postWidth / 2);
    
    // Top arms of the Y
    const armLength = postWidth * 0.6;
    const armAngle = Math.PI / 4; // 45 degrees
    
    // Left arm
    this.ctx.moveTo(x, centerY - postWidth / 2);
    this.ctx.lineTo(
      x + Math.cos(Math.PI - armAngle) * armLength,
      centerY - postWidth / 2 + Math.sin(Math.PI - armAngle) * armLength
    );
    
    // Right arm
    this.ctx.moveTo(x, centerY - postWidth / 2);
    this.ctx.lineTo(
      x + Math.cos(-Math.PI + armAngle) * armLength,
      centerY - postWidth / 2 + Math.sin(-Math.PI + armAngle) * armLength
    );
    
    this.ctx.stroke();
    
    // Add shadow/depth effect
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.beginPath();
    this.ctx.moveTo(x + 2, centerY - postWidth / 2);
    this.ctx.lineTo(x + 2, centerY + postWidth / 2);
    this.ctx.stroke();
  }
}