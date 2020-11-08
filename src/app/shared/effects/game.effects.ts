import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { map, switchMap } from 'rxjs/operators';
import { CREATE_GAME, CREATE_SUCCESS } from '../actions/game.actions';
import { GAME_PATH, PARTY_PATH } from './firestore-paths';

@Injectable()
export class GameEffects {

    constructor(private actions$: Actions, private afs: AngularFirestore, private translate: TranslateService) {}

    @Effect()
    createGame$ = this.actions$.pipe(
        ofType(CREATE_GAME),
        switchMap((action: any) => {
            return this.afs.collection(`${PARTY_PATH}/${action.partyName}/${GAME_PATH}`)
                .add(JSON.parse(JSON.stringify(action.game)));
        }),
        map((doc) => {
            const successMessage = this.translate.instant('success.game.created', { id: doc.id });
            return ({ type: CREATE_SUCCESS, successMessage });
        })
    );
}
