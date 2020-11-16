import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { setPartyStep } from 'src/app/shared/actions/party.actions';
import { setPlayerStep } from 'src/app/shared/actions/player.actions';
import { Game } from 'src/app/shared/models/game.model';
import { Player } from 'src/app/shared/models/player.model';
import { Step } from 'src/app/shared/steps/step';
import { STEP_CHECK_IN_GAME, STEP_PLAY_GAME } from 'src/app/shared/steps/steps';
import { selectParty, selectPartyStep } from 'src/app/shared/reducers/party.reducer';
import { LobbyParentComponent } from '../lobby-parent/lobby-parent.component';
import * as games from 'src/app/shared/reducers/game.reducer';
import * as players from 'src/app/shared/reducers/player.reducer';

@Component({
  selector: 'app-lobby-game-guide',
  templateUrl: './lobby-game-guide.component.html',
  styleUrls: ['./lobby-game-guide.component.css']
})
export class LobbyGameGuideComponent extends LobbyParentComponent implements OnInit {

  
  currPlayer$: Observable<Player>;
  players$: Observable<Player[]>;
  checkedIn = false;

  gameDisplayName = '';
  gameDisplayInstructions = '';

  constructor(protected route: ActivatedRoute, 
    protected store: Store,
    private translate: TranslateService, 
    private router: Router) {
      super(route, store);
  }
  
  ngOnInit(): void {
    super.ngOnInit();

    this.currPlayer$ = this.store.select(players.selectCurrPlayer, { playerFireId: this.playerFireId });
    this.players$ = this.store.select(players.selectAll);
    
    this.initDisplayData();
    this.processPartyStep();
    this.processPlayerStep(this.playerFireId);
  }

  onCheckInGame() {
    const step: Step = {
      step: STEP_CHECK_IN_GAME.step, 
      done: true
    }
    this.currPlayer$.subscribe(currPlayer => this.store.dispatch(setPlayerStep({player: currPlayer, step})));
  }

  isPlayerReadyForTheGame(player: Player) {
    return (player?.step?.step === STEP_CHECK_IN_GAME.step && player.step?.done);
  }

  private initDisplayData() {
    // TODO use games.selectCurrGame
    this.store.select(games.selectAll).pipe(takeUntil(this.unsub$)).subscribe(games => {
      const currGame = games[0]; 
      if (currGame) {
        this.gameDisplayName = this.translate.instant(`game.${currGame.id}.name`);
        this.gameDisplayInstructions = this.translate.instant(`game.${currGame.id}.instructions`);
      }
    });
  }

  private processPlayerStep(playerFireId: string) {
    const currGame$ = this.store.select(games.selectCurrGame);
    const playerStep$ = this.store.select(players.selectCurrPlayerStep, { playerFireId });
    combineLatest(playerStep$, currGame$)
      .pipe(
        takeUntil(this.unsub$),
        filter(([playerStep, currGame]) => (!!playerStep && !!currGame)),
        tap(([playerStep, currGame]) => {
          if (playerStep.step === STEP_CHECK_IN_GAME.step) {
            this.checkedIn = playerStep.done;
          }
          if (playerStep.step === STEP_PLAY_GAME.step && !playerStep.done) {
            this.router.navigate([`/${currGame.id}/${this.partyName}/${this.playerFireId}`], { relativeTo: this.route });
          }
        })
      ).subscribe();
  }
  private processPartyStep() {
    const partyStep$ = this.store.select(selectPartyStep);
    combineLatest(this.currPlayer$, partyStep$)
      .pipe(
        takeUntil(this.unsub$),
        filter(([player, partyStep]) => (!!player && !!partyStep)),
        tap(([player, partyStep]) => {
          if (player.step.step !== partyStep.step) {
            this.store.dispatch(setPlayerStep({ player: player , step: partyStep }));
          }
        })
      ).subscribe();

    /**
     * HOST CONTROLS PARTY STEP
     */
    const party$ = this.store.select(selectParty).pipe(filter(p => p.name !== ''));
    // const players$ = this.store.select(players.selectAll);
    combineLatest(party$, this.players$)
      .pipe(
        takeUntil(this.unsub$),
        tap(([party, players]) => {
          if (players.every(p => p.step.step === STEP_CHECK_IN_GAME.step && p.step.done)) {
            // all players are ready for the game
            this.store.dispatch(setPartyStep({ step: STEP_PLAY_GAME }));
            // const success$ = this.actions$.pipe(ofType(SET_PLAYER_STEP_SUCCESS));
            // const failed$ = this.actions$.pipe(ofType(FAILED));
            // return race(success$, failed$);
          }
          // return EMPTY;
        })
      ).subscribe();
  }
}
