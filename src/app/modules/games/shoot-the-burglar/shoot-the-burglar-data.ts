export interface ShootTheBurglarData {
  textToType: string;
  // burglars:
  // princesses:
  rounds: ShootTheBurglarRound[];
}

export interface ShootTheBurglarRound {
  reveal: string;
  timeUntilReveal: number;
}
