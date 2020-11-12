import { createAction, props } from '@ngrx/store';
import { Party } from '../models/party.model';
import { Step } from '../steps/step';

const PARTY_TAG = '[Party]';

export const CREATE_PARTY_IF_NOT_ALREADY_EXISTS = `${PARTY_TAG} create a new party if not already exists`;
export const createPartyIfNotAlreadyExists = createAction(CREATE_PARTY_IF_NOT_ALREADY_EXISTS, props<{ name: string }>());
export type CreatePartyIfNotAlreadyExists = ReturnType<typeof createPartyIfNotAlreadyExists>;

export const JOIN_PARTY_IF_EXISTS = `${PARTY_TAG} join party if it exists`;
export const joinPartyIfExists = createAction(JOIN_PARTY_IF_EXISTS, props<{ name: string }>());
export type JoinPartyIfExists = ReturnType<typeof joinPartyIfExists>;

export const CREATE_PARTY = `${PARTY_TAG} create party in firestore`;
export const createParty = createAction(CREATE_PARTY, props<{ partyName: string }>());
export type CreateParty = ReturnType<typeof createParty>;

export const QUERY_PARTY = `${PARTY_TAG} query collection`;
export const queryParty = createAction(QUERY_PARTY, props<{ name: string }>());
export type QueryParty = ReturnType<typeof queryParty>;

export const UPDATE_PARTY = `${PARTY_TAG} update data`;
export const updateParty = createAction(UPDATE_PARTY, props<{party: Party }>());

export const SUCCESS = `${PARTY_TAG} success`;
export const success = createAction(SUCCESS, props<{ successMessage: string }>());

export const FAILED = `${PARTY_TAG} failed`;
export const failed = createAction(FAILED, props<{ errorMessage: string }>());

export const ALREADY_EXISTS = `${PARTY_TAG} already exists`;
export const alreadyExists = createAction(ALREADY_EXISTS);

/**
 * Step (=States) (maybe more than one action?)
 */
export const SET_STEP = `${PARTY_TAG} set step`;
export const setStep = createAction(SET_STEP, props<{ step: Step }>());
export type SetStep = ReturnType<typeof setStep>;
