import { createAction, props } from '@ngrx/store';

export const SAVE_CURR_PLAYER = '[Player] save curr player';
export const SUCCESS = '[Player] success';

export const saveCurrPlayer = createAction(SAVE_CURR_PLAYER, props<{ currPlayer: string }>());
export const success = createAction(SUCCESS);