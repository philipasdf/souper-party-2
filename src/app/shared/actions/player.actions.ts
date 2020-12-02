import { createAction, props } from '@ngrx/store';
import { Player } from '../models/player.model';
import { Step } from '../steps/step';

const PLAYER_TAG = '[Player]';

export const SAVE_CURR_PLAYER = `${PLAYER_TAG} save curr player`;
export const saveCurrPlayer = createAction(SAVE_CURR_PLAYER, props<{ currPlayer: string }>());
export type SaveCurrPlayer = ReturnType<typeof saveCurrPlayer>;

export const CREATE_PLAYER_IF_NOT_ALREADY_EXISTS = `${PLAYER_TAG} create player if not already exists`;
export const createPlayerIfNotAlreadyExists = createAction(
  CREATE_PLAYER_IF_NOT_ALREADY_EXISTS,
  props<{ party: string; playerName: string }>()
);
export type CreatePlayerIfNotAlreadyExists = ReturnType<typeof createPlayerIfNotAlreadyExists>;

export const CREATE_PLAYER = `${PLAYER_TAG} create player`;
export const createPlayer = createAction(CREATE_PLAYER, props<{ partyName: string; player: Player }>());
export type CreatePlayer = ReturnType<typeof createPlayer>;

export const QUERY_PLAYERS = `${PLAYER_TAG} query collection`;
export const queryPlayers = createAction(QUERY_PLAYERS, props<{ party: string }>());
export type QueryPlayers = ReturnType<typeof queryPlayers>;

export const UPDATE_PLAYERS = `${PLAYER_TAG} update data`;
export const updatePlayers = createAction(UPDATE_PLAYERS, props<{ players: Player[] }>());

export const SUCCESS = `${PLAYER_TAG} success`;
export const success = createAction(SUCCESS);

export const JOIN_PARTY_SUCCESS = `${PLAYER_TAG} successfully joined party`;
export const joinPartySuccess = createAction(
  JOIN_PARTY_SUCCESS,
  props<{ successMessage: string; partyName: string; playerFireId: string }>()
);

export const FAILED = `${PLAYER_TAG} failed`;
export const failed = createAction(FAILED, props<{ errorMessage: string }>());

export const SET_PLAYER_AVATAR = `${PLAYER_TAG} set avatar`;
export const setPlayerAvatar = createAction(SET_PLAYER_AVATAR, props<{ avatar: string; avatarUrl: string }>());
export type SetPlayerAvatar = ReturnType<typeof setPlayerAvatar>;

/**
 * Step (=States) (maybe more than one action?)
 */
export const SET_PLAYER_STEP = `${PLAYER_TAG} set step`;
// export const setStep = createAction(SET_STEP, props<{ playerName: string, step: Step }>());
export const setPlayerStep = createAction(SET_PLAYER_STEP, props<{ player: Player; step: Step }>());
export type SetPlayerStep = ReturnType<typeof setPlayerStep>;

export const SET_PLAYER_STEP_SUCCESS = `${PLAYER_TAG} set step success`;
export const setPlayerStepSuccess = createAction(SET_PLAYER_STEP_SUCCESS);
