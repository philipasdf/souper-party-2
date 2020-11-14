import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import { CreateGame, CREATE_GAME, QueryGames, QUERY_GAMES, success, UPDATE_GAMES } from '../actions/game.actions';
import { FAILED } from '../actions/game.actions';
import { SET_STEP } from '../actions/party.actions';
import { GameFsService } from '../firestore-services/game-fs.service';
import { STEP_CHECK_IN_GAME } from '../steps/steps';

@Injectable()
export class GameEffects {

    constructor(private actions$: Actions, 
                private gameFs: GameFsService, 
                private translate: TranslateService, 
                private store: Store) {}

    @Effect()
    createGame$ = this.actions$.pipe(
        ofType(CREATE_GAME),
        switchMap((action: CreateGame) => {
                return this.gameFs.addGame(action.partyName, action.game);
        }),
        map((doc) => {
            const successMessage = this.translate.instant('success.game.created', { id: doc.id });
            this.store.dispatch(success(successMessage));
            return ({ type: SET_STEP, step: STEP_CHECK_IN_GAME });
        }),
        catchError(err => of({ type: FAILED, errorMessage: 'Failed to create a game in firestore'}))
    );

    @Effect()
    query$ = this.actions$.pipe(
        ofType(QUERY_GAMES),
        exhaustMap((action: QueryGames) => this.gameFs.fetchGames(action.partyName)),
        map((col) => ({ type: UPDATE_GAMES, games: col }))
    );
    
}
