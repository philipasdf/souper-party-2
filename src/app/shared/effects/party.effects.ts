import { Injectable } from '@angular/core';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  CreateParty,
  CreatePartyIfNotAlreadyExists,
  CREATE_PARTY,
  CREATE_PARTY_IF_NOT_ALREADY_EXISTS,
  FAILED,
  JoinPartyIfExists,
  joinPartyIfExists,
  JOIN_PARTY_IF_EXISTS,
  QueryParty,
  QUERY_PARTY,
  SetPartyStep,
  SET_PARTY_STEP,
  SET_PARTY_STEP_SUCCESS,
  SUCCESS,
  UPDATE_PARTY,
} from '../actions/party.actions';
import { CREATE_PLAYER_IF_NOT_ALREADY_EXISTS } from '../actions/player.actions';
import { PartyFsService } from '../firestore-services/party-fs.service';
import { Party } from '../models/party.model';
import { selectCurrPlayerName } from '../reducers/player.reducer';
import { selectPartyName } from '../reducers/party.reducer';
import { IDLE } from '../steps/steps';

@Injectable()
export class PartyEffects {
  constructor(
    private actions$: Actions,
    private store: Store<Party>,
    private partyFs: PartyFsService,
    private translate: TranslateService
  ) {}

  @Effect()
  createPartyIfNotAlreadyExists$: Observable<Action> = this.actions$.pipe(
    ofType(CREATE_PARTY_IF_NOT_ALREADY_EXISTS),
    switchMap((action: CreatePartyIfNotAlreadyExists) => {
      return this.partyFs.checkIfPartyExists(action.name).pipe(
        map((doc) => {
          if (doc.exists) {
            const errorMessage = this.translate.instant('error.party.alreadyExists', { name: action.name });
            return { type: FAILED, errorMessage };
          } else {
            return { type: CREATE_PARTY, partyName: action.name };
          }
        })
      );
    }),
    catchError((err) => of({ type: FAILED, errorMessage: this.translate.instant('error.party.createProcessFailed') }))
  );

  @Effect()
  createParty$: Observable<Action> = this.actions$.pipe(
    ofType(CREATE_PARTY),
    withLatestFrom(this.store.select(selectCurrPlayerName)),
    switchMap(([action, currPlayer]: [CreateParty, string]) => {
      const partyName = action.partyName;
      const party: Party = {
        name: partyName,
        host: currPlayer,
        step: IDLE,
      };
      return this.partyFs.createParty(partyName, party).pipe(
        map(() => {
          const successMessage = this.translate.instant('success.party.created', { name: partyName });
          this.store.dispatch(joinPartyIfExists({ name: partyName }));
          return { type: SUCCESS, successMessage };
        })
      );
    }),
    catchError((err) => of({ type: FAILED, errorMessage: this.translate.instant('error.party.createDocumentFailed') }))
  );

  @Effect()
  joinPartyIfExists$: Observable<Action> = this.actions$.pipe(
    ofType(JOIN_PARTY_IF_EXISTS),
    withLatestFrom(this.store.select(selectCurrPlayerName)),
    switchMap(([action, currPlayer]: [JoinPartyIfExists, string]) => {
      const partyName = action.name;
      return this.partyFs.checkIfPartyExists(partyName).pipe(
        map((doc: DocumentSnapshot<Party>) => {
          if (doc.exists) {
            return { type: CREATE_PLAYER_IF_NOT_ALREADY_EXISTS, party: partyName, playerName: currPlayer };
          } else {
            const errorMessage = this.translate.instant('error.party.doesNotExist', { name: partyName });
            return { type: FAILED, errorMessage };
          }
        })
      );
    })
  );

  @Effect()
  query$ = this.actions$.pipe(
    ofType(QUERY_PARTY),
    exhaustMap((action: QueryParty) => this.partyFs.fetchParty(action.name)),
    map((doc: Party) => ({ type: UPDATE_PARTY, party: doc }))
  );

  @Effect()
  setStep$ = this.actions$.pipe(
    ofType(SET_PARTY_STEP),
    withLatestFrom(this.store.select(selectPartyName)),
    switchMap(([action, partyName]: [SetPartyStep, string]) => {
      const _partyName = action.partyName ? action.partyName : partyName;
      return this.partyFs.setStep(_partyName, action.step);
    }),
    map(() => ({ type: SET_PARTY_STEP_SUCCESS })),
    catchError((err) => of({ type: FAILED, errorMessage: this.translate.instant('error.party.updateStepFailed') }))
  );
}
