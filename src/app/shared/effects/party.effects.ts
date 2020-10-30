import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentSnapshot } from '@angular/fire/firestore';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ADD_PARTY, ALREADY_EXISTS, CREATE_A_NEW_PARTY, FAILED, JOIN_EXISTING_PARTY, SUCCESS } from '../actions/party.actions';
import { Party } from '../models/party.model';
import { selectParty } from '../reducers/party.reducer';
import { PARTY_PATH } from './firestore-paths';

@Injectable()
export class PartyEffects {

    constructor(private actions$: Actions, private store: Store<Party>, private afs: AngularFirestore) {}

    @Effect()
    createNewParty$: Observable<Action> = this.actions$.pipe(
        ofType(CREATE_A_NEW_PARTY),
        switchMap( (action: any) => this.afs.doc(`${PARTY_PATH}/${action.name}`).get()),
        map((doc: DocumentSnapshot<Party>) => {
            if (doc.exists) {
                return ({ type: FAILED, errorMessage: 'party already exists' });
            } else {
                return ({ type: ADD_PARTY });
            }
        }),
        catchError(err => of({ type: FAILED, errorMessage: 'failed during create-party-process' }))
    );

    @Effect()
    addParty$: Observable<Action> = this.actions$.pipe(
        ofType(ADD_PARTY),
        withLatestFrom(this.store.select(selectParty)),
        switchMap(([action, party]: [Action, Party]) => {
            const partyName = party.name;
            return this.afs.doc<Party>(`${PARTY_PATH}/${partyName}`).set({ name: partyName});
        }),
        map(() => ({ type: SUCCESS, successMessage: 'party successfully created' })),
        catchError(err => of({ type: FAILED, errorMessage: 'failed to create party document on firestore' }))
    );

    @Effect()
    joinExistingParty$: Observable<Action> = this.actions$.pipe(
        ofType(JOIN_EXISTING_PARTY)
        // check if party exists
            // err party already exists
        // check if username exists in party
            // err username already exists
            //  createPlayer
        
    );
}