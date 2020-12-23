import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { setPlayerStep } from 'src/app/shared/actions/player.actions';
import { Player } from 'src/app/shared/models/player.model';
import { selectPartyStep, selectPartyHost, selectCurrGameIndex } from 'src/app/shared/reducers/party.reducer';
import {
  selectAll,
  selectCurrPlayer,
  selectCurrPlayerName,
  selectCurrPlayerStep,
} from 'src/app/shared/reducers/player.reducer';
import { IDLE, STEP_CHECK_IN_GAME } from 'src/app/shared/steps/steps';
import { GameService } from '../../games/services/game.service';
import { LobbyParentComponent } from '../lobby-parent/lobby-parent.component';

@Component({
  selector: 'app-lobby-home',
  templateUrl: './lobby-home.component.html',
  styleUrls: ['./lobby-home.component.css'],
})
export class LobbyHomeComponent extends LobbyParentComponent implements OnInit {
  partyHost$: Observable<string>;
  players$: Observable<Player[]>;
  currPlayerName$: Observable<string>;

  constructor(
    protected route: ActivatedRoute,
    protected store: Store,
    private router: Router,
    private gameService: GameService
  ) {
    super(route, store);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.initDisplayData();
    this.processPartyStep(this.playerFireId);
    this.processPlayerStep(this.playerFireId);
  }

  onStartGame() {
    this.store
      .select(selectCurrGameIndex)
      .pipe(takeUntil(this.unsub$))
      .subscribe((currGameIndex: number) => {
        let gameIndex: number = 0;
        if (currGameIndex) {
          gameIndex = parseInt(`${currGameIndex}`, 10) + 1; // Problem 0 + 1 = 01 somehow
        }
        this.gameService.loadGamePreparer(this.partyName, this.playerFireId, 'shoot-the-burglar', gameIndex);
      });
  }

  private initDisplayData() {
    this.currPlayerName$ = this.store.select(selectCurrPlayerName);
    this.players$ = this.store.select(selectAll);
    this.partyHost$ = this.store.select(selectPartyHost);
  }

  private processPartyStep(playerFireId: string) {
    const player$ = this.store.select(selectCurrPlayer, { playerFireId });
    const partyStep$ = this.store.select(selectPartyStep);
    combineLatest(player$, partyStep$)
      .pipe(
        takeUntil(this.unsub$),
        filter(([player, partyStep]) => !!player && !!partyStep),
        map(([player, partyStep]) => {
          if (partyStep.step === IDLE.step && player.step.step !== IDLE.step) {
            this.store.dispatch(setPlayerStep({ player: player, step: IDLE }));
          }
          if (partyStep.step === STEP_CHECK_IN_GAME.step && player.step.step !== STEP_CHECK_IN_GAME.step) {
            this.store.dispatch(setPlayerStep({ player: player, step: STEP_CHECK_IN_GAME }));
          }
        })
      )
      .subscribe();
  }

  private processPlayerStep(playerFireId: string) {
    this.store
      .select(selectCurrPlayerStep, { playerFireId })
      .pipe(
        takeUntil(this.unsub$),
        filter((playerStep) => !!playerStep),
        tap((playerStep) => {
          if (playerStep.step === STEP_CHECK_IN_GAME.step && !playerStep.done) {
            this.router.navigate(['game-guide'], { relativeTo: this.route });
          }
        })
      )
      .subscribe();
  }
}
