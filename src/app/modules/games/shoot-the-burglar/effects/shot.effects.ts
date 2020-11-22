import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, withLatestFrom } from 'rxjs/operators';
import { selectPartyName } from 'src/app/shared/reducers/party.reducer';
import {
  AddShot,
  ADD_SHOT,
  ADD_SHOT_FAILED,
  ADD_SHOT_SUCCESS,
  QueryShots,
  QUERY_SHOTS,
  UPDATE_SHOTS,
} from '../actions/shot.actions';
import { ShotFsService } from '../firestore-service/shot-fs.service';

@Injectable()
export class ShotEffects {
  constructor(private actions$: Actions, private shotFs: ShotFsService, private store: Store) {}

  @Effect()
  addShot$ = this.actions$.pipe(
    ofType(ADD_SHOT),
    withLatestFrom(this.store.select(selectPartyName)),
    map(([action, partyName]: [AddShot, string]) => {
      return this.shotFs.addShot(partyName, action.gameFireId, action.shot);
    }),
    map(() => ({ type: ADD_SHOT_SUCCESS })),
    catchError((err) => of({ type: ADD_SHOT_FAILED }))
  );

  @Effect()
  query$ = this.actions$.pipe(
    ofType(QUERY_SHOTS),
    exhaustMap((action: QueryShots) => this.shotFs.fetchShots(action.partyName, action.gameFireId)),
    map((col) => ({ type: UPDATE_SHOTS, shots: col }))
  );
}
