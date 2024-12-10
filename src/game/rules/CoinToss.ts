export class CoinToss {
  private firstPossession: 'home' | 'away';
  private deferredChoice: boolean = false;

  constructor() {
    this.firstPossession = Math.random() < 0.5 ? 'home' : 'away';
  }

  public execute(): 'home' | 'away' {
    // Simulate coin toss winner choosing to defer
    this.deferredChoice = Math.random() < 0.3;
    return this.deferredChoice ? 
      (this.firstPossession === 'home' ? 'away' : 'home') : 
      this.firstPossession;
  }

  public getSecondHalfPossession(): 'home' | 'away' {
    return this.deferredChoice ? 
      this.firstPossession : 
      (this.firstPossession === 'home' ? 'away' : 'home');
  }
}