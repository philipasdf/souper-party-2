import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Game } from '../models/game.model';
import * as gameActions from '../actions/game.actions';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { selectCurrGameIndex } from './party.reducer';

export const adapter = createEntityAdapter<Game>();
export interface State extends EntityState<Game> {}
export const initialState = adapter.getInitialState();

const reducer = createReducer(
  initialState,
  on(gameActions.updateGames, (state, { games }) => adapter.setAll(games, state))
);

export function gameReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}

// Selectors
export const selectFeature = createFeatureSelector<State>('game');
export const { selectAll } = adapter.getSelectors(selectFeature);
export const selectCurrGame = createSelector(selectFeature, selectCurrGameIndex, (games, currGameIndex) => {
  return Object.values(games.entities).find((g) => g.index === currGameIndex);
});
