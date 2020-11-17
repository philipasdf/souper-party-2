import { createAction, props } from '@ngrx/store';
import { Game } from '../models/game.model';

export const CREATE_GAME = '[Game] create game';
export const createGame = createAction(CREATE_GAME, props<{ game: Game; partyName: string }>());
export type CreateGame = ReturnType<typeof createGame>;

export const SUCCESS = '[Game] success';
export const success = createAction(SUCCESS, props<{ successMessage: string }>());

export const FAILED = '[Game] failed';
export const failed = createAction(FAILED, props<{ errorMessage: string }>());

export const QUERY_GAMES = '[Game] query collection';
export const queryGames = createAction(QUERY_GAMES, props<{ partyName: string }>());
export type QueryGames = ReturnType<typeof queryGames>;

export const UPDATE_GAMES = '[Game] update data';
export const updateGames = createAction(UPDATE_GAMES, props<{ games: Game[] }>());
export type UpdateGames = ReturnType<typeof updateGames>;
