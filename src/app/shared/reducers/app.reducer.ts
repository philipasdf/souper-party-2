import { ActionReducerMap } from '@ngrx/store';
import { Game } from '../models/game.model';
import { Party } from '../models/party.model';
import { gameReducer } from './game.reducer';
import { partyReducer } from './party.reducer';
import { playerReducer, State } from './player.reducer';

export interface AppState {
    name: string,
    game: Game,
    party: Party,
    player: State
}

export const appReducers: ActionReducerMap<any> = {
    player: playerReducer,
    party: partyReducer,
    game: gameReducer
}