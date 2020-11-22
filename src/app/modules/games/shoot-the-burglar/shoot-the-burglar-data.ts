export interface ShootTheBurglarData {
  // burglars: with burglar id
  // princesses: with princess id
  rounds: ShootTheBurglarRound[];
}

export interface ShootTheBurglarRound {
  reveal: string; // burglar or princess TODO burglar/princess id
  timeUntilReveal: number; // time until burglar/princess reveals
  stayTime: number; // time until burglar/princess disappears
}
