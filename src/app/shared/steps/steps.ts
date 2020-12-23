import { Step } from './step';

/**
 * Steps sind eine Eigenerfindung. Sie sollen States sein, jedoch wollte ich das wording zu NgRx Store differenzieren.
 */

export const IDLE: Step = {
  step: 'idle',
  done: true,
};

export const STEP_CHECK_IN_GAME: Step = {
  step: 'check-in-game',
  done: false,
};

export const STEP_PLAY_GAME: Step = {
  step: 'play-game',
  done: false,
};

export const GAME_OVER: Step = {
  step: 'game-over',
  done: false,
};
