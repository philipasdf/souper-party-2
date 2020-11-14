import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { queryGames } from 'src/app/shared/actions/game.actions';
import { queryParty } from 'src/app/shared/actions/party.actions';
import { queryPlayers, setStep, SET_STEP_SUCCESS, SUCCESS } from 'src/app/shared/actions/player.actions';
import { Game } from 'src/app/shared/models/game.model';
import { Player } from 'src/app/shared/models/player.model';
import { selectAll } from 'src/app/shared/reducers/game.reducer';
import { selectCurrPlayer } from 'src/app/shared/reducers/player.reducer';
import { Step } from 'src/app/shared/steps/step';
import { STEP_CHECK_IN_GAME } from 'src/app/shared/steps/steps';

@Component({
  selector: 'app-lobby-game-guide',
  templateUrl: './lobby-game-guide.component.html',
  styleUrls: ['./lobby-game-guide.component.css']
})
export class LobbyGameGuideComponent implements OnInit, OnDestroy {

  partyName: string;
  playerFireId: string;
  currPlayer: Player;
  currGame: Game;

  gameDisplayName = '';
  gameDisplayInstructions = '';
  
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
    this.store.select(selectAll).pipe(takeUntil(this.unsub$)).subscribe(games => {
      this.currGame = games[0];
      if (this.currGame) {
        this.gameDisplayName = this.translate.instant(`game.${this.currGame.id}.name`);
        this.gameDisplayInstructions = this.translate.instant(`game.${this.currGame.id}.instructions`);
      }
    });
  }

  onCheckInGame() {
    const step: Step = {
      step: STEP_CHECK_IN_GAME.step, 
      done: true
    }
    this.store.dispatch(setStep({player: this.currPlayer, step}));
    this.actions$
      .pipe(ofType(SET_STEP_SUCCESS), takeUntil(this.unsub$))
      .subscribe(() => this.router.navigate([`lobby/${this.partyName}/${this.playerFireId}`]));
  }
}
