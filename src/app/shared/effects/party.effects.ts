import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ADD_PARTY, CREATE_A_NEW_PARTY, FAILED, JOIN_EXISTING_PARTY, SUCCESS } from '../actions/party.actions';
import { Party } from '../models/party.model';
import { selectParty } from '../reducers/party.reducer';
import { PARTY_PATH } from './firestore-paths';

@Injectable()
export class PartyEffects {

    constructor(private actions$: Actions, 
                private store: Store<Party>, 
                private afs: AngularFirestore, 
                private translate: TranslateService) {}

    @Effect()
    createNewParty$: Observable<Action> = this.actions$.pipe(
        ofType(CREATE_A_NEW_PARTY),
        switchMap( (action: any) => this.afs.doc(`${PARTY_PATH}/${action.name}`).get()),
        map((doc: DocumentSnapshot<Party>) => {
            if (doc.exists) {
                return ({ type: FAILED, errorMessage: this.translate.instant('error.party.alreadyExists') });
            } else {
                return ({ type: ADD_PARTY });
            }
        }),
        catchError(err => of({ type: FAILED, errorMessage: this.translate.instant('error.party.createProcessFailed') }))
    );

    @Effect()
    addParty$: Observable<Action> = this.actions$.pipe(
        ofType(ADD_PARTY),
        withLatestFrom(this.store.select(selectParty)),
        switchMap(([action, party]: [Action, Party]) => {
            const partyName = party.name;
            return this.afs.doc<Party>(`${PARTY_PATH}/${partyName}`).set({ name: partyName});
        }),
        map(() => ({ type: SUCCESS, successMessage: this.translate.instant('success.party.created') })),
        catchError(err => of({ type: FAILED, errorMessage: this.translate.instant('error.party.createDocumentFailed') }))
    );

    @Effect()
    joinExistingParty$: Observable<Action> = this.actions$.pipe(
        ofType(JOIN_EXISTING_PARTY),
        switchMap((action: any) => this.afs.doc(`${PARTY_PATH}/${action.name}`).get()),
        map((doc: DocumentSnapshot<Party>) => {
            if (doc.exists) {
                // check if username exists in party
                // err username already exists
                //  createPlayer
                return ({ type: SUCCESS });
            } else {
                return ({ type: FAILED, errorMessage: this.translate.instant('error.party.doesNotExist')});
            }
        })
    );
}