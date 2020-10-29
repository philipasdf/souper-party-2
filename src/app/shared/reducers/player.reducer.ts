import * as playerActions from '../actions/player.actions';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Player } from '../models/player.model';
import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { CURR_PLAYER_KEY } from '../local-storage-keys';

export const adapter = createEntityAdapter<Player>();
export interface State extends EntityState<Player> {
    currPlayer: string
}
export const initialState = adapter.getInitialState({
    currPlayer: localStorage.getItem(CURR_PLAYER_KEY) ? localStorage.getItem(CURR_PLAYER_KEY) : ''
});

const reducer = createReducer(
    initialState,
    on(playerActions.saveCurrPlayer, (state, { currPlayer }) => {
        return { ...state, currPlayer }
    })
);

export function playerReducer(state: State | undefined, action: Action) {
    console.log(action.type, state);
    return reducer(state, action);
}
        
// Selectors
export const selectFeature = createFeatureSelector<State>('player');
export const {
    selectIds,
    selectEntities,
    selectAll
} = adapter.getSelectors(selectFeature);
export const selectCurrPlayer = createSelector(
    selectFeature,
    (state: State) => state.currPlayer
);