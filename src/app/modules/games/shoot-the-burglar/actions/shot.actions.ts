import { createAction, props } from '@ngrx/store';
import { Shot } from '../models/shot.model';

export const ADD_SHOT = '[Shot] add shot to collection';
export const addShot = createAction(ADD_SHOT, props<{ gameFireId: string; shot: Shot }>());
export type AddShot = ReturnType<typeof addShot>;

export const ADD_SHOT_SUCCESS = '[Shot] add shot to collection successful';
export const addShotSuccess = createAction(ADD_SHOT_SUCCESS);

export const ADD_SHOT_FAILED = '[Shot] add shot to collection failed';
export const addShotFailed = createAction(ADD_SHOT_FAILED);

export const QUERY_SHOTS = '[Shot] query shots collection';
export const queryShots = createAction(QUERY_SHOTS, props<{ partyName: string; gameFireId: string }>());
export type QueryShots = ReturnType<typeof queryShots>;

export const UPDATE_SHOTS = '[Shot] update shots';
export const updateShots = createAction(UPDATE_SHOTS, props<{ shots: Shot[] }>());
export type UpdateShots = ReturnType<typeof updateShots>;
