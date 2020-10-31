import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { from, Observable, of } from 'rxjs';
import { CREATE_PLAYER, CREATE_PLAYER_IF_NOT_ALREADY_EXISTS, SAVE_CURR_PLAYER, SUCCESS } from '../actions/player.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CURR_PLAYER_KEY } from '../local-storage-keys';
import { AngularFirestore } from '@angular/fire/firestore';
import { TranslateService } from '@ngx-translate/core';
import { Party } from '../models/party.model';
import { PARTY_PATH, PLAYER_PATH } from './firestore-paths';
import { FAILED } from '../actions/party.actions';

@Injectable()
export class PlayerEffects {

        
    constructor(private actions$: Actions, 
        private store: Store<Party>, 
        private afs: AngularFirestore, 
        private translate: TranslateService) {}

    @Effect()
    saveCurrPlayer$: Observable<Action> = this.actions$.pipe(
        ofType(SAVE_CURR_PLAYER),
        map( (action: any) => {
            localStorage.setItem(CURR_PLAYER_KEY, action.currPlayer);
            return { type: SUCCESS };
        })
    );

    @Effect()
    createPlayerIfNotAlreadyExists$: Observable<Action> = this.actions$.pipe(
        ofType(CREATE_PLAYER_IF_NOT_ALREADY_EXISTS),
        switchMap((action: any) => {
            return this.afs.doc(`${PARTY_PATH}/${action.party}/${PLAYER_PATH}/${action.player}`)
                .get()
                .pipe(
                    map(doc => {
                        if (doc.exists) {
                            const errorMessage = this.translate.instant('error.player.alreadyExists', { partyName: action.party, nickname: action.player });
                            return ({ type: FAILED, errorMessage });
                        } else {
                            return ({ type: CREATE_PLAYER, party: action.party, player: action.player });
                        }
                    })
                )
        }),
        catchError(() => of({ type: FAILED, errorMessage: this.translate.instant('error.player.joinPartyFailed') }))
    );

    @Effect()
    createPlayer$: Observable<Action> = this.actions$.pipe(
        ofType(CREATE_PLAYER),
        switchMap((action: any) => {
            return from(this.afs.doc(`${PARTY_PATH}/${action.party}/${PLAYER_PATH}/${action.player}`)
                    .set({ name: action.player }))
                    .pipe(
                        map(() => {
                            const successMessage = this.translate.instant('success.player.created', { name: action.player });
                            return ({ type: SUCCESS, successMessage });
                        })
                    );
        }),
        catchError(() => of({ type: FAILED, errorMessage: this.translate.instant('error.player.joinPartyFailed') }))
    );
}