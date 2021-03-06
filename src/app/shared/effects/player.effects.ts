import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  CreatePlayer,
  CreatePlayerIfNotAlreadyExists,
  CREATE_PLAYER,
  CREATE_PLAYER_IF_NOT_ALREADY_EXISTS,
  JOIN_PARTY_SUCCESS,
  QueryPlayers,
  QUERY_PLAYERS,
  SaveCurrPlayer,
  SAVE_CURR_PLAYER,
  SetPlayerStep,
  SET_PLAYER_STEP,
  SET_PLAYER_STEP_SUCCESS,
  SUCCESS,
  UPDATE_PLAYERS,
  FAILED,
  SET_PLAYER_AVATAR,
  SetPlayerAvatar,
  INCREMENT_PLAYER_POINTS,
  IncrementPlayerPoints,
} from '../actions/player.actions';
import { PlayerFsService } from '../firestore-services/player-fs.service';
import { CURR_PLAYER_KEY } from '../local-storage-keys';
import { Player } from '../models/player.model';
import { selectPartyName } from '../reducers/party.reducer';
import { selectCurrPlayerName } from '../reducers/player.reducer';
import { IDLE } from '../steps/steps';

@Injectable()
export class PlayerEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private playerFs: PlayerFsService,
    private afs: AngularFirestore,
    private translate: TranslateService
  ) {}

  @Effect()
  saveCurrPlayer$: Observable<Action> = this.actions$.pipe(
    ofType(SAVE_CURR_PLAYER),
    map((action: SaveCurrPlayer) => {
      localStorage.setItem(CURR_PLAYER_KEY, action.currPlayer);
      return { type: SUCCESS };
    })
  );

  @Effect()
  createPlayerIfNotAlreadyExists$: Observable<Action> = this.actions$.pipe(
    ofType(CREATE_PLAYER_IF_NOT_ALREADY_EXISTS),
    switchMap((action: CreatePlayerIfNotAlreadyExists) => {
      return this.playerFs.checkIfPlayerExists(action.party, action.playerName).pipe(
        map((doc) => {
          if (doc.exists) {
            const errorMessage = this.translate.instant('error.player.alreadyExists', {
              partyName: action.party,
              nickname: action.playerName,
            });
            return { type: FAILED, errorMessage };
          } else {
            const player: Player = {
              id: action.playerName,
              name: action.playerName,
              fireId: this.afs.createId(),
              points: 0,
              step: IDLE,
            };
            return { type: CREATE_PLAYER, partyName: action.party, player };
          }
        })
      );
    }),
    catchError(() => of({ type: FAILED, errorMessage: this.translate.instant('error.player.joinPartyFailed') }))
  );

  @Effect()
  createPlayer$: Observable<Action> = this.actions$.pipe(
    ofType(CREATE_PLAYER),
    switchMap((action: CreatePlayer) => {
      return this.playerFs.createPlayer(action.partyName, action.player).pipe(
        map(() => {
          const successMessage = this.translate.instant('success.player.created', {
            name: action.player.name,
          });
          return {
            type: JOIN_PARTY_SUCCESS,
            successMessage,
            partyName: action.partyName,
            playerFireId: action.player.fireId,
          };
        })
      );
    }),
    catchError(() => of({ type: FAILED, errorMessage: this.translate.instant('error.player.joinPartyFailed') }))
  );

  @Effect()
  query$ = this.actions$.pipe(
    ofType(QUERY_PLAYERS),
    exhaustMap((action: QueryPlayers) => this.playerFs.fetchPlayers(action.party)),
    map((col) => ({ type: UPDATE_PLAYERS, players: col }))
  );

  @Effect()
  setStep$ = this.actions$.pipe(
    ofType(SET_PLAYER_STEP),
    withLatestFrom(this.store.select(selectPartyName)),
    switchMap(([action, partyName]: [SetPlayerStep, string]) =>
      this.playerFs.setStep(partyName, action.player.name, action.step)
    ),
    map(() => {
      // console.log('%c SERVICE: setStep success', 'color: green');
      return { type: SET_PLAYER_STEP_SUCCESS };
    }),
    catchError((err) => of({ type: FAILED, errorMessage: this.translate.instant('error.player.updateStepFailed') }))
  );

  @Effect()
  setPlayerAvatar = this.actions$.pipe(
    ofType(SET_PLAYER_AVATAR),
    withLatestFrom(this.store.select(selectPartyName), this.store.select(selectCurrPlayerName)),
    switchMap(([action, partyName, playerName]: [SetPlayerAvatar, string, string]) => {
      return this.playerFs.setAvatar(partyName, playerName, action.avatar, action.avatarUrl);
    }),
    map(() => ({ type: SUCCESS })),
    catchError((err) => of({ type: FAILED, errorMessage: this.translate.instant('error.player.updateAvatarFailed') }))
  );

  @Effect()
  incrementPlayerPoints$ = this.actions$.pipe(
    ofType(INCREMENT_PLAYER_POINTS),
    withLatestFrom(this.store.select(selectPartyName)),
    switchMap(([action, partyName]: [IncrementPlayerPoints, string]) => {
      return this.playerFs.incrementPoints(partyName, action.player);
    }),
    map(() => ({ type: SUCCESS })),
    catchError((err) => of({ type: FAILED, errorMessage: 'failed to increment player points' }))
  );
}
