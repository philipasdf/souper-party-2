import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { CreateGame, CREATE_GAME, SET_PLAYERSTATES_AND_NAVIGATE, SetPlayerstatesAndNavigate } from '../actions/game.actions';
import { SUCCESS, FAILED } from '../actions/game.actions';
import { GameFsService } from '../firestore-services/game-fs.service';

@Injectable()
export class GameEffects {

    constructor(private actions$: Actions, 
                private gameFs: GameFsService, 
                private translate: TranslateService, 
                private router: Router, 
                private store: Store) {}

    @Effect()
    createGame$ = this.actions$.pipe(
        ofType(CREATE_GAME),
        switchMap((action: CreateGame) => {
                return this.gameFs.addGame(action.partyName, action.game);
        }),
        map((doc) => {
            const successMessage = this.translate.instant('success.game.created', { id: doc.id });
            return ({ type: SET_PLAYERSTATES_AND_NAVIGATE, successMessage });
        }),
        catchError(err => of({ type: FAILED, errorMessage: 'Failed to create a game in firestore'}))
    );

    @Effect()
    setPlayerstatesAndNavigate$ = this.actions$.pipe(
        ofType(SET_PLAYERSTATES_AND_NAVIGATE),
        withLatestFrom(this.store),
        map(([action, state]: [SetPlayerstatesAndNavigate, any]) => {


                // dispatch player action
                // player.effects: iterate collection and set states?? 
                // ==> if not working then set party state? => then all players set their own state?  

                console.log(state);

                this.router.navigate([`lobby/${state.party.name}/${state.party.hostFireId}`]);

                return ({ type: SUCCESS, successMessage: 'successfully set state for all players and redirect host back to lobby' });
        })
    );
}
