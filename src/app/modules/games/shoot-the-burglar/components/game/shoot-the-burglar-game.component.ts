import { hostViewClassName } from '@angular/compiler';
import { Component, HostListener, OnInit } from '@angular/core';
import { validateEventsArray } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subject, timer } from 'rxjs';
import { filter, timeInterval, timeout, timestamp } from 'rxjs/operators';
import { queryGames } from 'src/app/shared/actions/game.actions';
import { queryParty } from 'src/app/shared/actions/party.actions';
import { queryPlayers } from 'src/app/shared/actions/player.actions';
import { Player } from 'src/app/shared/models/player.model';
import { selectCurrGame } from 'src/app/shared/reducers/game.reducer';
import { selectAll } from 'src/app/shared/reducers/player.reducer';
import { GameCountdownService } from '../../game-countdown/game-countdown.service';
import { ShootTheBurglarData } from '../shoot-the-burglar-data';

@Component({
  selector: 'app-shoot-the-burglar-game',
  templateUrl: './shoot-the-burglar-game.component.html',
  styleUrls: ['./shoot-the-burglar-game.component.css'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class ShootTheBurglarGameComponent implements OnInit {
  data: ShootTheBurglarData;

  countdownEnded$ = new Subject();
  shots$ = new Subject();
  players$: Observable<Player[]>;

  currRound = 1;
  revealed = '';
  shotTime: number;
  score = 0;
  life = 3;
  revealedTimestamp: number;

  constructor(private route: ActivatedRoute, private store: Store, private countdown: GameCountdownService) {}

  ngOnInit() {
    const componentRef = this.countdown.startCountdown();
    componentRef.onDestroy(() => this.countdownEnded$.next(true));

    const partyName = this.route.snapshot.params['partyName'];
    const playerFireId = this.route.snapshot.params['playerFireId'];
    this.store.dispatch(queryParty({ name: partyName }));
    this.store.dispatch(queryPlayers({ party: partyName }));
    this.store.dispatch(queryGames({ partyName })); // TODO query only one game

    const game$ = this.store.select(selectCurrGame);
    this.players$ = this.store.select(selectAll);

    combineLatest(game$, this.countdownEnded$)
      .pipe(filter(([game, countdownEnded]) => !!game && !!countdownEnded))
      .subscribe(([game, _]) => {
        this.data = game?.gameData?.data;
        this.startGame();
        this.playRound();
      });

    this.shots$
      .pipe(timestamp())
      .subscribe((shot) => (this.shotTime = this.revealedTimestamp ? shot.timestamp - this.revealedTimestamp : null));
  }

  startGame() {}

  async playRound() {
    const round = this.data.rounds[this.currRound - 1];
    // reset data
    this.shotTime = null;
    this.revealed = '';

    await timer(round.timeUntilReveal).toPromise();
    this.revealedTimestamp = new Date().getTime();
    this.revealed = round.reveal;

    await timer(2000).toPromise();
    console.log('timeout!');
    this.calculateScore(round.reveal, this.shotTime);
  }

  onClick(event) {
    this.shots$.next();
  }

  private calculateScore(revealed: string, shotTime?: number) {
    if (shotTime && revealed === 'burglar') {
      // TODO who was the fastest?
      // fire actions
      this.score++;
    }

    if (shotTime && revealed === 'princess') {
      // update player life--
      this.life--;
    }

    timer(2000)
      .toPromise()
      .then(() => this.nextRoundOrGameOver());
  }

  nextRoundOrGameOver() {
    // TODO update round
    this.currRound++;
    if (this.currRound > this.data.rounds.length) {
      console.log('game over');
    } else {
      this.playRound();
    }
  }
}
