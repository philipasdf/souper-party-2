import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';
import { Game } from "../models/game.model";
import * as gameActions from '../actions/game.actions';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export const adapter = createEntityAdapter<Game>();
export interface State extends EntityState<Game>{};
export const initialState = adapter.getInitialState();

const reducer = createReducer(
    initialState,
    on(gameActions.createGame, (state, action) => adapter.addOne(action.game, state)) // TODO maybe redundant with game.query
);

export function gameReducer(state: State | undefined, action: Action) {
    return reducer(state, action);
}

// Selectors
export const selectFeature = createFeatureSelector<State>('game');
export const { selectAll } = adapter.getSelectors(selectFeature);