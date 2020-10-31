import { ActionReducerMap } from '@ngrx/store';
import { Party } from '../models/party.model';
import { partyReducer } from './party.reducer';
import { playerReducer, State } from './player.reducer';

export interface AppState {
    name: string,
    party: Party,
    player: State
}

export const appReducers: ActionReducerMap<any> = {
    player: playerReducer,
    party: partyReducer
}