import { ActionReducerMap } from '@ngrx/store';
import { playerReducer } from './shared/reducers/player.reducer';

export const appReducers: ActionReducerMap<any> = {
    player: playerReducer
}