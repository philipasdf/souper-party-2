import { createAction, props } from '@ngrx/store';
import { Party } from '../models/party.model';

export const CREATE_PARTY_IF_NOT_ALREADY_EXISTS = '[Party] create a new party if not already exists';
export const JOIN_PARTY_IF_EXISTS = '[Party] join party if it exists';
export const CREATE_PARTY = '[Party] create party in firestore';
export const QUERY_PARTY = '[Party] query';
export const UPDATE_PARTY = '[Party] update data';
export const SUCCESS = '[Party] success';
export const FAILED = '[Party] failed';
export const ALREADY_EXISTS = '[Party] already exists';

export const createPartyIfNotAlreadyExists = createAction(CREATE_PARTY_IF_NOT_ALREADY_EXISTS, props<{ name: string }>());
export type CreatePartyIfNotAlreadyExists = ReturnType<typeof createPartyIfNotAlreadyExists>;
export const joinPartyIfExists = createAction(JOIN_PARTY_IF_EXISTS, props<{ name: string }>());
export type JoinPartyIfExists = ReturnType<typeof joinPartyIfExists>;
export const createParty = createAction(CREATE_PARTY, props<{ partyName: string }>());
export type CreateParty = ReturnType<typeof createParty>;
export const queryParty = createAction(QUERY_PARTY, props<{ name: string }>());
export type QueryParty = ReturnType<typeof queryParty>;
export const updateParty = createAction(UPDATE_PARTY, props<{party: Party }>());
export const success = createAction(SUCCESS, props<{ successMessage: string }>());
export const failed = createAction(FAILED, props<{ errorMessage: string }>());
export const alreadyExists = createAction(ALREADY_EXISTS);
