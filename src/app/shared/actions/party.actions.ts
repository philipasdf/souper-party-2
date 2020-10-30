import { createAction, props } from '@ngrx/store';

export const CREATE_A_NEW_PARTY = '[Party] create a new party';
export const JOIN_EXISTING_PARTY = '[Party] join an existing party';
export const ADD_PARTY = '[Party] add to firestore';
export const QUERY_PARTY = '[Party] query';
export const SUCCESS = '[Party] success';
export const FAILED = '[Party] failed';
export const ALREADY_EXISTS = '[Party] already exists';

export const createParty = createAction(CREATE_A_NEW_PARTY, props<{ name: string }>());
export const joinParty = createAction(JOIN_EXISTING_PARTY, props<{ name: string }>());
export const addParty = createAction(ADD_PARTY);
export const queryParty = createAction(QUERY_PARTY);
export const success = createAction(SUCCESS, props<{ successMessage: string }>());
export const failed = createAction(FAILED, props<{ errorMessage: string }>());
export const alreadyExists = createAction(ALREADY_EXISTS);
