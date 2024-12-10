export class Penalties {
  private readonly PENALTY_TYPES = {
    HOLDING: { yards: -10, type: 'offensive' },
    PASS_INTERFERENCE: { yards: 15, type: 'defensive' },
    OFFSIDES: { yards: 5, type: 'defensive' },
    FALSE_START: { yards: -5, type: 'offensive' },
    DELAY_OF_GAME: { yards: -5, type: 'offensive' },
    FACEMASK: { yards: 15, type: 'defensive' }
  };

  public checkForPenalty(): { type: string; yards: number } | null {
    // Base 8% chance for a penalty
    if (Math.random() < 0.08) {
      const penaltyTypes = Object.keys(this.PENALTY_TYPES);
      const selectedPenalty = penaltyTypes[Math.floor(Math.random() * penaltyTypes.length)];
      return {
        type: selectedPenalty,
        yards: this.PENALTY_TYPES[selectedPenalty].yards
      };
    }
    return null;
  }

  public checkForDelayOfGame(playClockExpired: boolean): boolean {
    return playClockExpired;
  }
}