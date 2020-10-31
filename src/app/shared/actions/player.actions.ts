import { createAction, props } from '@ngrx/store';

export const SAVE_CURR_PLAYER = '[Player] save curr player';
export const CREATE_PLAYER_IF_NOT_ALREADY_EXISTS = '[Player] create player if not already exists';
export const CREATE_PLAYER = '[Player] create player';
export const SUCCESS = '[Player] success';

export const saveCurrPlayer = createAction(SAVE_CURR_PLAYER, props<{ currPlayer: string }>());
export const createPlayerIfNotAlreadyExists = createAction(CREATE_PLAYER_IF_NOT_ALREADY_EXISTS, props<{ party: string, player: string }>());
export const createPlayer = createAction(CREATE_PLAYER, props<{ party: string, player: string }>());
export const success = createAction(SUCCESS);