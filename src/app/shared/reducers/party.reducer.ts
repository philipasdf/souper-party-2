import { Action, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { Party } from '../models/party.model';
import * as partyActions from '../actions/party.actions';

const initialState: Party = {
    name: ''
}

const reducer = createReducer(
    initialState,
    on(partyActions.createParty, (state, { name }) => { 
        return { ...state, name };
    }),
    on(partyActions.joinPartyIfExists, (state, { name }) => { 
        return { ...state, name };
    }),
    on(partyActions.failed, (state, { errorMessage }) => { 
        console.error(errorMessage, state);
        return { ...state };
    }),
);

export function partyReducer(state: Party | undefined, action: Action) {
    console.log(`${action.type} state`, state);
    console.log(`${action.type} payload`, action);
    return reducer(state, action);
}

export const selectFeature = createFeatureSelector<Party>('party');
export const selectParty = createSelector(selectFeature, state => state);