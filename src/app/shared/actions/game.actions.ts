import { createAction, props } from '@ngrx/store';
import { Game } from '../models/game.model';

export const CREATE_GAME = '[Game] create game';
export const SET_PLAYERSTATES_AND_NAVIGATE = '[Game] set playerstates and navigate';
export const SUCCESS = '[Game] success';
export const FAILED = '[Game] failed';

export const createGame = createAction(CREATE_GAME, props<{ game: Game, partyName: string }>());
export type CreateGame = ReturnType<typeof createGame>;
export const setPlayerstatesAndNavigate = createAction(SET_PLAYERSTATES_AND_NAVIGATE, props<{ successMessage: string }>());
export type SetPlayerstatesAndNavigate = ReturnType<typeof setPlayerstatesAndNavigate>;
export const success = createAction(SUCCESS, props<{ successMessage: string }>());
export const failed = createAction(FAILED, props<{ errorMessage: string }>());