import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { catchError, combineAll, exhaustMap, map, switchMap } from 'rxjs/operators';
import {
  CreateGame,
  CREATE_GAME,
  FAILED,
  QueryGames,
  QUERY_GAMES,
  success,
  UPDATE_GAMES,
} from '../actions/game.actions';
import { SET_PARTY_STEP } from '../actions/party.actions';
import { GameFsService } from '../firestore-services/game-fs.service';
import { PartyFsService } from '../firestore-services/party-fs.service';
import { STEP_CHECK_IN_GAME } from '../steps/steps';

@Injectable()
export class GameEffects {
  constructor(
    private actions$: Actions,
    private gameFs: GameFsService,
    private partyFs: PartyFsService,
    private translate: TranslateService,
    private store: Store
  ) {}

  @Effect()
  createGame$ = this.actions$.pipe(
    ofType(CREATE_GAME),
    switchMap((action: CreateGame) => {
      return this.partyFs.setCurrGameFireId(action.partyName, action.game.index).pipe(
        map(() => this.gameFs.createGame(action.partyName, action.game)),
        combineAll()
      );
    }),
    map(() => {
      const successMessage = this.translate.instant('success.game.created', { id: 'todoremove' });
      this.store.dispatch(success(successMessage));
      return { type: SET_PARTY_STEP, step: STEP_CHECK_IN_GAME };
    }),
    catchError((err) => of({ type: FAILED, errorMessage: 'Failed to create a game in firestore' }))
  );

  @Effect()
  query$ = this.actions$.pipe(
    ofType(QUERY_GAMES),
    exhaustMap((action: QueryGames) => this.gameFs.fetchGames(action.partyName)),
    map((col) => ({ type: UPDATE_GAMES, games: col }))
  );
}
