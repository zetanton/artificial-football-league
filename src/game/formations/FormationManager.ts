import { Formation } from '../../types/game';

interface PlayerPosition {
  x: number;
  y: number;
  position: string;
}

export class FormationManager {
  private readonly FORMATIONS: Record<Formation, (baseX: number, baseY: number) => PlayerPosition[]> = {
    'I-Formation': this.getIFormation.bind(this),
    'Shotgun': this.getShotgunFormation.bind(this),
    'Single Back': this.getSingleBackFormation.bind(this),
    'Goal Line': this.getGoalLineFormation.bind(this)
  };

  public getFormationPositions(formation: Formation, baseX: number, baseY: number): PlayerPosition[] {
    return this.FORMATIONS[formation](baseX, baseY);
  }

  private getIFormation(baseX: number, baseY: number): PlayerPosition[] {
    return [
      { x: baseX - 30, y: baseY, position: 'QB' },
      { x: baseX - 20, y: baseY, position: 'FB' },
      { x: baseX - 10, y: baseY, position: 'HB' },
      ...this.getOffensiveLine(baseX, baseY)
    ];
  }

  private getShotgunFormation(baseX: number, baseY: number): PlayerPosition[] {
    return [
      { x: baseX - 40, y: baseY, position: 'QB' },
      { x: baseX - 35, y: baseY + 20, position: 'HB' },
      { x: baseX - 35, y: baseY - 20, position: 'WR' },
      ...this.getOffensiveLine(baseX, baseY)
    ];
  }

  private getSingleBackFormation(baseX: number, baseY: number): PlayerPosition[] {
    return [
      { x: baseX - 30, y: baseY, position: 'QB' },
      { x: baseX - 20, y: baseY, position: 'HB' },
      ...this.getOffensiveLine(baseX, baseY)
    ];
  }

  private getGoalLineFormation(baseX: number, baseY: number): PlayerPosition[] {
    return [
      { x: baseX - 20, y: baseY, position: 'QB' },
      { x: baseX - 10, y: baseY - 10, position: 'HB' },
      { x: baseX - 10, y: baseY + 10, position: 'FB' },
      ...this.getOffensiveLine(baseX, baseY)
    ];
  }

  private getOffensiveLine(baseX: number, baseY: number): PlayerPosition[] {
    return [
      { x: baseX, y: baseY - 20, position: 'OL' },
      { x: baseX, y: baseY - 10, position: 'OL' },
      { x: baseX, y: baseY, position: 'OL' },
      { x: baseX, y: baseY + 10, position: 'OL' },
      { x: baseX, y: baseY + 20, position: 'OL' }
    ];
  }
}