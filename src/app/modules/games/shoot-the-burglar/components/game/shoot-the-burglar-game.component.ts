import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Subject, timer } from 'rxjs';
import { filter, takeUntil, timestamp } from 'rxjs/operators';
import * as shots from 'src/app/modules/games/shoot-the-burglar/reducers/shot.reducer';
import { queryGames } from 'src/app/shared/actions/game.actions';
import { queryParty } from 'src/app/shared/actions/party.actions';
import { queryPlayers } from 'src/app/shared/actions/player.actions';
import { UnsubscribingComponent } from 'src/app/shared/components/unsubscribing/unsubscribing.component';
import { Player } from 'src/app/shared/models/player.model';
import { selectCurrGame } from 'src/app/shared/reducers/game.reducer';
import * as players from 'src/app/shared/reducers/player.reducer';
import { GameCountdownService } from '../../../game-countdown/game-countdown.service';
import { addShot, queryShots } from '../../actions/shot.actions';
import { Shot } from '../../models/shot.model';
import { ShootTheBurglarData } from '../../shoot-the-burglar-data';
import { REVEALED_CONFIGS } from '../revealed/reavealed-configs';
import { ShootTheBurglarService } from './shoot-the-burglar.service';

@Component({
  selector: 'app-shoot-the-burglar-game',
  templateUrl: './shoot-the-burglar-game.component.html',
  styleUrls: ['./shoot-the-burglar-game.component.css'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class ShootTheBurglarGameComponent extends UnsubscribingComponent implements OnInit {
  playerFireId: string;
  gameFireId: string;
  data: ShootTheBurglarData;
  RESPONSIVE_WIDTH = 0;

  preloadImgs = [];
  countdownEnded$ = new Subject();
  triggerShot$ = new Subject();
  players: Player[];
  playerScores: { fireId: string }[] = []; // score: if you shot a burglar first, you earn one score

  currRound = 1;
  revealed = '';
  revealedImg = null;
  scoresMap: Map<string, number>;
  lifepointsMap: Map<string, number>;
  revealedTimestamp: number;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private countdown: GameCountdownService,
    private shootTheBurglar: ShootTheBurglarService
  ) {
    super();
  }

  async ngOnInit() {
    this.RESPONSIVE_WIDTH = Math.min(window.outerWidth, 500);
    this.loadAllImages();

    const componentRef = this.countdown.startCountdown();
    componentRef.onDestroy(() => this.countdownEnded$.next(true));

    const partyName = this.route.snapshot.params['partyName'];
    const gameFireId = this.route.snapshot.params['gameFireId'];
    this.playerFireId = this.route.snapshot.params['playerFireId'];
    this.store.dispatch(queryParty({ name: partyName }));
    this.store.dispatch(queryPlayers({ party: partyName }));
    this.store.dispatch(queryGames({ partyName }));
    this.store.dispatch(queryShots({ partyName, gameFireId }));

    this.store
      .select(players.selectAll)
      .pipe(takeUntil(this.unsub$))
      .subscribe((players) => (this.players = players));

    const game$ = this.store.select(selectCurrGame);
    combineLatest(game$, this.countdownEnded$)
      .pipe(filter(([game, countdownEnded]) => !!game && !!countdownEnded))
      .subscribe(([game, _]) => {
        this.gameFireId = `${game?.index}`;
        this.data = game?.gameData?.data;
        this.revealBurglarsAndPrincesses();
      });

    this.processTriggers();
    this.processShots();
  }

  private loadAllImages() {
    REVEALED_CONFIGS.forEach((r) => this.preloadImgs.push(r.src));
  }

  onClick(event: MouseEvent) {
    event.preventDefault();
    this.triggerShot$.next(event);
    this.drawRipple(event.clientX, event.clientY);
  }

  async revealBurglarsAndPrincesses() {
    while (this.currRound <= this.data.rounds.length) {
      this.revealed = '';
      this.revealedImg = null;
      const round = this.data.rounds[this.currRound - 1];

      await timer(round.timeUntilReveal).toPromise();
      this.revealedTimestamp = new Date().getTime();
      this.revealed = round.reveal.role;
      this.revealedImg = this.getPlayerAvatar(round.reveal.playerFireId);

      await timer(round.stayTime).toPromise();
      this.currRound++;
    }
    this.gameOver();
  }

  private getPlayerAvatar(fireId: string): string {
    return this.players.find((p) => p.fireId === fireId).avatarUrl;
  }

  private gameOver() {
    console.log('game over');
    // update player step
    // host observes all players steps and processes further
  }

  private processTriggers() {
    this.triggerShot$.pipe(timestamp()).subscribe((trigger: { value: MouseEvent; timestamp: number }) => {
      const shot: Shot = {
        id: `${this.playerFireId}-${trigger.timestamp}`,
        shotTime: this.revealedTimestamp ? trigger.timestamp - this.revealedTimestamp : null,
        target: this.revealed,
        targetIndex: this.currRound,
        timestamp: trigger.timestamp,
        userFireId: this.playerFireId,
        relativeX: trigger.value.x / this.RESPONSIVE_WIDTH,
        relativeY: trigger.value.y / this.RESPONSIVE_WIDTH,
      };

      this.store.dispatch(addShot({ gameFireId: this.gameFireId, shot }));
    });
  }

  private processShots() {
    this.store
      .select(shots.selectAll)
      .pipe(
        takeUntil(this.unsub$),
        filter((shots) => !!shots && shots.length > 0)
      )
      .subscribe((shots: Shot[]) => {
        this.scoresMap = this.shootTheBurglar.calculateScores(shots, this.currRound);
        this.lifepointsMap = this.shootTheBurglar.calculateLifepoints(shots, this.players);
        this.triggerShotAnimation(shots[shots.length - 1]);
      });
  }

  private triggerShotAnimation(shot: Shot) {
    const name = this.players.find((p) => shot.userFireId === p.fireId).name;
    console.log(`%c ${name} shots ${shot.targetIndex}-${shot.target} in ${shot.shotTime} ms!`, 'color: red');

    // TODO make another animation, which displays the name, ms and stays until new round (and green color if hit, red if loosing life)
    const x = this.RESPONSIVE_WIDTH * shot.relativeX;
    const y = this.RESPONSIVE_WIDTH * shot.relativeY;
    this.drawRipple(x, y);
  }

  getScore(playerFireId: string) {
    return this.shootTheBurglar.getScore(playerFireId, this.scoresMap);
  }

  getLifepoints(playerFireId: string) {
    return this.shootTheBurglar.getLifepoints(playerFireId, this.lifepointsMap);
  }

  private drawRipple(x, y) {
    const node = document.querySelector('.ripple');
    const newNode: any = node.cloneNode(true);
    newNode.classList.add('animate');
    newNode.style.left = x - 5 + 'px';
    newNode.style.top = y - 5 + 'px';
    node.parentNode.replaceChild(newNode, node);
  }
}
