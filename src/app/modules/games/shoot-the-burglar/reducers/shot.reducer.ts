import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Shot } from '../models/shot.model';
import { addShotFailed, addShotSuccess, updateShots } from '../actions/shot.actions';

export const adapter = createEntityAdapter<Shot>();
export interface State extends EntityState<Shot> {}
export const initialState = adapter.getInitialState();

const reducer = createReducer(
  initialState,
  on(updateShots, (state, { shots }) => adapter.setAll(shots, state))
);

export function shotReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}

// Selectors
export const selectFeature = createFeatureSelector<State>('shot');
export const { selectAll } = adapter.getSelectors(selectFeature);
