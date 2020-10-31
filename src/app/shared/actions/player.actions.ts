import { createAction, props } from '@ngrx/store';
import { Player } from '../models/player.model';

export const SAVE_CURR_PLAYER = '[Player] save curr player';
export const CREATE_PLAYER_IF_NOT_ALREADY_EXISTS = '[Player] create player if not already exists';
export const CREATE_PLAYER = '[Player] create player';
export const SUCCESS = '[Player] success';
export const JOIN_PARTY_SUCCESS = '[Player] successfully joined party';

export const saveCurrPlayer = createAction(SAVE_CURR_PLAYER, props<{ currPlayer: string }>());
export const createPlayerIfNotAlreadyExists = createAction(CREATE_PLAYER_IF_NOT_ALREADY_EXISTS, props<{ party: string, player: string }>());
export const createPlayer = createAction(CREATE_PLAYER, props<{ party: string, player: Player }>());
export const success = createAction(SUCCESS);
export const joinPartySuccess = createAction(JOIN_PARTY_SUCCESS, props<{ successMessage: string, partyName: string, playerFireId: string }>());