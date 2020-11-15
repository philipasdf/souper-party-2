import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, EMPTY, Subject } from 'rxjs';
import { exhaustMap, filter, takeUntil, tap } from 'rxjs/operators';
import { queryGames } from 'src/app/shared/actions/game.actions';
import { queryParty } from 'src/app/shared/actions/party.actions';
import { queryPlayers, setPlayerStep, SET_PLAYER_STEP_SUCCESS } from 'src/app/shared/actions/player.actions';
import { Party } from 'src/app/shared/models/party.model';
import { Player } from 'src/app/shared/models/player.model';
import { AppState } from 'src/app/shared/reducers/app.reducer';
import { selectPartyStep } from 'src/app/shared/reducers/party.reducer';
import { selectCurrPlayer, selectCurrPlayerStep } from 'src/app/shared/reducers/player.reducer';
import { Step } from 'src/app/shared/steps/step';
import { STEP_CHECK_IN_GAME } from 'src/app/shared/steps/steps';
import { GameService } from '../../games/services/game.service';

@Component({
  selector: 'app-lobby-home',
  templateUrl: './lobby-home.component.html',
  styleUrls: ['./lobby-home.component.css']
})
export class LobbyHomeComponent implements OnInit, OnDestroy {

  state: AppState; // for debugging
  currPlayerName = '';
  currPlayer: Player;
  party: Party;
  step: Step;
  players: Player[];
  partyName = '';
  playerFireId = '';

  unsub$ = new Subject();

  constructor(private route: ActivatedRoute, 
              private store: Store, 
              private router: Router,
              private gameService: GameService, 
              private actions$: Actions) { }

  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  ngOnInit(): void {
    this.partyName = this.route.snapshot.params['partyName'];
    this.playerFireId = this.route.snapshot.params['playerFireId'];

    this.store.dispatch(queryParty({name: this.partyName}));
    this.store.dispatch(queryPlayers({party: this.partyName}));
    this.store.dispatch(queryGames({partyName: this.partyName}));

    this.setData();
    this.processSteps(this.playerFireId);

    // TODO host has to watch if all players have step=partyStep && step.done = true
  }

  private setData() {
    this.store.pipe(takeUntil(this.unsub$), filter(this.notEmpty)).subscribe((state: AppState) => {
      this.state = state; // for debugging
      this.party          = state.party;
      this.step           = state.party.step;
      this.currPlayerName = state.player.currPlayer;
      this.currPlayer     = state.player.entities[this.currPlayerName];
      this.players        = Object.values(state.player.entities);
      // console.log('Set AppState', state);
    });
  }

  private processSteps(playerFireId: string) {
    const player$ = this.store.select(selectCurrPlayer, { playerFireId });
    const partyStep$ = this.store.select(selectPartyStep);
    combineLatest(player$, partyStep$)
      .pipe(
        takeUntil(this.unsub$),
        filter(([player, partyStep]) => (!!player && !!partyStep)),
        // tap(([player, partyStep]) => console.log(player.step, partyStep)),
        exhaustMap(([player, partyStep]) => {
          console.log('evaluate steps between player and party', player.step, partyStep);
          if (player.step.step !== partyStep.step) {
            console.log('Party and Player have different steps -> update Player Step');
            this.store.dispatch(setPlayerStep({ player: player , step: partyStep }));
            return this.actions$.pipe(ofType(SET_PLAYER_STEP_SUCCESS));
          }
          return EMPTY;
        })
      ).subscribe();

    this.store.select(selectCurrPlayerStep, { playerFireId }).pipe(
        takeUntil(this.unsub$),
        filter(playerStep => !!playerStep)).subscribe(playerStep => {
      console.log('evaluate step of player', playerStep);
      switch(playerStep.step) {
        case(STEP_CHECK_IN_GAME.step):
          if (!playerStep.done) {
            console.log('navigate to game-guide');
            this.router.navigate(['game-guide'], { relativeTo: this.route });
          }
          break;
        default:
          break;
      }
    });
  }

  

  onStartGame() {
    const gameIndex = 0// TODO games.length oder so
    this.gameService.loadGamePreparer(this.partyName, this.playerFireId, 'quick-typing', gameIndex);
  }

  private notEmpty(state: AppState) {
    if (state.party.name == '' || 
        Object.keys(state.player.entities).length === 0 ||
        !state.player.currPlayer) {
      return false;
    }
    return true;
  }
}
