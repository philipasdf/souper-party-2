import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { asyncScheduler, combineLatest, concat, EMPTY, Observable, race, Scheduler, Subject } from 'rxjs';
import { exhaustMap, filter, map, observeOn, takeUntil, tap } from 'rxjs/operators';
import { queryGames } from 'src/app/shared/actions/game.actions';
import { FAILED, queryParty, setPartyStep, SET_PARTY_STEP_SUCCESS } from 'src/app/shared/actions/party.actions';
import { queryPlayers, setPlayerStep, SET_PLAYER_STEP_SUCCESS, SUCCESS } from 'src/app/shared/actions/player.actions';
import { Game } from 'src/app/shared/models/game.model';
import { Player } from 'src/app/shared/models/player.model';
import { selectParty, selectPartyStep } from 'src/app/shared/reducers/party.reducer';
import { selectCurrPlayer, selectCurrPlayerStep } from 'src/app/shared/reducers/player.reducer';
import { Step } from 'src/app/shared/steps/step';
import { STEP_CHECK_IN_GAME, STEP_PLAY_GAME } from 'src/app/shared/steps/steps';
import * as games from 'src/app/shared/reducers/game.reducer';
import * as players from 'src/app/shared/reducers/player.reducer';
import { BrowserStack } from 'protractor/built/driverProviders';
import { AsapScheduler } from 'rxjs/internal/scheduler/AsapScheduler';
import { ɵangular_packages_platform_browser_dynamic_platform_browser_dynamic_a } from '@angular/platform-browser-dynamic';

@Component({
  selector: 'app-lobby-game-guide',
  templateUrl: './lobby-game-guide.component.html',
  styleUrls: ['./lobby-game-guide.component.css']
})
export class LobbyGameGuideComponent implements OnInit, OnDestroy {

  partyName: string;
  playerFireId: string;
  currPlayer: Player;
  players$: Observable<Player[]>;
  games$: Observable<Game[]>;
  currGame: Game;
  checkedIn = false;

  gameDisplayName = '';
  gameDisplayInstructions = '';
  

  stepUpdate$ = new Subject();
  unsub$ = new Subject();

  constructor(private route: ActivatedRoute, 
    private store: Store,
    private translate: TranslateService, 
    private actions$: Actions,
    private router: Router) { }

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

    this.store.select(selectCurrPlayer, { playerFireId: this.playerFireId }).pipe(takeUntil(this.unsub$)).subscribe(currPlayer => this.currPlayer = currPlayer);
    this.games$ = this.store.select(games.selectAll).pipe(takeUntil(this.unsub$));
    this.players$ = this.store.select(players.selectAll);
    
    
    this.initDisplayData();
    this.processSteps();
  }

  onCheckInGame() {
    const step: Step = {
      step: STEP_CHECK_IN_GAME.step, 
      done: true
    }
    this.store.dispatch(setPlayerStep({player: this.currPlayer, step}));
  }

  isPlayerReadyForTheGame(player: Player) {
    return (player?.step?.step === STEP_CHECK_IN_GAME.step && player.step?.done);
  }

  private initDisplayData() {
    this.games$.subscribe(games => {
      this.currGame = games[0]; // TODO
      if (this.currGame) {
        this.gameDisplayName = this.translate.instant(`game.${this.currGame.id}.name`);
        this.gameDisplayInstructions = this.translate.instant(`game.${this.currGame.id}.instructions`);
      }
    });
  }

  private processSteps() {
    /**
     * PARTY STEP
     */
    const player$ = this.store.select(selectCurrPlayer, { playerFireId: this.playerFireId });
    const partyStep$ = this.store.select(selectPartyStep);
    combineLatest(player$, partyStep$)
      .pipe(
        takeUntil(this.unsub$),
        filter(([player, partyStep]) => (!!player && !!partyStep)),
        tap(([player, partyStep]) => {
          console.log('evaluate steps between player and party', player.step, partyStep);
          if (player.step.step !== partyStep.step) {
            console.log('Party and Player have different steps -> update Player Step');
            this.store.dispatch(setPlayerStep({ player: player , step: partyStep }));
            // return this.actions$.pipe(ofType(SET_PLAYER_STEP_SUCCESS));
          }
          // return EMPTY;
        })
      ).subscribe();

    /**
     * PLAYER STEP
     */
    const currGame$ = this.store.select(games.selectCurrGame);
    const playerStep$ = this.store.select(selectCurrPlayerStep, { playerFireId: this.playerFireId });
    combineLatest(playerStep$, currGame$)
      .pipe(
        takeUntil(this.unsub$),
        filter(([playerStep, currGame]) => (!!playerStep && !!currGame)))
        .subscribe(([playerStep, currGame]) => {
          console.log('evaluate step of player', playerStep);
          switch(playerStep.step) {
            case(STEP_CHECK_IN_GAME.step):
              this.checkedIn = playerStep.done;
              break;
            case(STEP_PLAY_GAME.step):
              if (!playerStep.done) {
                console.log('navigate to game');
                this.router.navigate([`/${currGame.id}/${this.partyName}/${this.playerFireId}`], { relativeTo: this.route });
              }
              break;
            default:
              break;
          }
        });

    /**
     * HOST CONTROLS PARTY STEP
     */
    const party$ = this.store.select(selectParty).pipe(filter(p => p.name !== ''));
    const players$ = this.store.select(players.selectAll);
    combineLatest(party$, players$)
      .pipe(
        takeUntil(this.unsub$),
        exhaustMap(([party, players]) => {
          if (players.every(p => p.step.step === STEP_CHECK_IN_GAME.step && p.step.done)) {
            console.log('everybody rdy, lets update party step!!');
            this.store.dispatch(setPartyStep({ step: STEP_PLAY_GAME }));
            const success$ = this.actions$.pipe(ofType(SET_PLAYER_STEP_SUCCESS));
            const failed$ = this.actions$.pipe(ofType(FAILED));
            return race(success$, failed$);
          }
          return EMPTY;
        })
      ).subscribe();


      /**
       * something must trigger the step processes again
       */
      const playerStepUpdates$ = this.actions$.pipe(ofType(SET_PLAYER_STEP_SUCCESS));
      const partyStepUpdates$ = this.actions$.pipe(ofType(SET_PARTY_STEP_SUCCESS));
      concat(playerStepUpdates$, partyStepUpdates$).subscribe(() => this.stepUpdate$.next());
  }
}
