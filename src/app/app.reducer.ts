import { ActionReducerMap } from '@ngrx/store';
import { partyReducer } from './shared/reducers/party.reducer';
import { playerReducer } from './shared/reducers/player.reducer';

export const appReducers: ActionReducerMap<any> = {
    player: playerReducer,
    party: partyReducer
}