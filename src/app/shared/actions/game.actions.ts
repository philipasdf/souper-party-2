import { createAction, props } from '@ngrx/store';
import { Game } from '../models/game.model';

export const CREATE_GAME = '[Game] create game';
export const CREATE_SUCCESS = '[Game] successfully created';

export const createGame = createAction(CREATE_GAME, props<{ game: Game, partyName: string }>());
export const createSuccess = createAction(CREATE_SUCCESS, props<{ successMessage: string }>());