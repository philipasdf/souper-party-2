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
import { REVEALED_CONFIGS } from '../revealed/revealed-configs';
import { ShotNotificationService } from '../shot-notifications/shot-notification.service';
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
  currRole = null;
  revealedId = null;
  revealedImg = null;
  scoresMap: Map<string, number>;
  lifepointsMap: Map<string, number>;
  revealedTimestamp: number;
  winners = null;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private countdown: GameCountdownService,
    private shootTheBurglar: ShootTheBurglarService,
    private shotNotification: ShotNotificationService
  ) {
    super();
  }

  async ngOnInit() {
    this.RESPONSIVE_WIDTH = Math.min(window.outerWidth, 500);
    this.loadAllImages();

    const componentRef = this.countdown.startCountdown();
    componentRef.onDestroy(() => this.countdownEnded$.next(true));

    const partyName = this.route.snapshot.params['partyName'];
    this.gameFireId = this.route.snapshot.params['gameFireId'];
    this.playerFireId = this.route.snapshot.params['playerFireId'];
    this.store.dispatch(queryParty({ name: partyName }));
    this.store.dispatch(queryPlayers({ party: partyName }));
    this.store.dispatch(queryGames({ partyName }));
    this.store.dispatch(queryShots({ partyName, gameFireId: this.gameFireId }));

    this.store
      .select(players.selectAll)
      .pipe(takeUntil(this.unsub$))
      .subscribe((players) => (this.players = players));

    combineLatest(this.store.select(selectCurrGame), this.countdownEnded$)
      .pipe(filter(([game, countdownEnded]) => !!game && !!countdownEnded))
      .subscribe(([game, _]) => {
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

    if (!this.isPlayerDead(this.playerFireId)) {
      this.triggerShot$.next(event);
      this.drawRipple(event.clientX, event.clientY);
    }
  }

  async revealBurglarsAndPrincesses() {
    while (this.currRound <= this.data.rounds.length) {
      this.currRole = null;
      this.revealedId = null;
      this.revealedImg = null;
      const round = this.data.rounds[this.currRound - 1];

      await timer(round.timeUntilReveal).toPromise();
      this.revealedTimestamp = new Date().getTime();
      this.currRole = round.reveal.role;
      this.revealedId = round.revealedId;
      this.revealedImg = this.getPlayerAvatar(round.reveal.playerFireId);

      const stayTime = this.currRole === 'burglar' ? 4000 : round.stayTime;
      await timer(stayTime).toPromise();
      this.shotNotification.clearList();
      this.currRound++;
    }
    this.gameOver();
  }

  private getPlayerAvatar(fireId: string): string {
    return this.players.find((p) => p.fireId === fireId).avatarUrl;
  }

  private gameOver() {
    console.log('game over');
    this.triggerWinnerAnimation();
    // update player step
    // host observes all players steps and processes further
  }

  private processTriggers() {
    this.triggerShot$.pipe(timestamp()).subscribe((trigger: { value: MouseEvent; timestamp: number }) => {
      const shot: Shot = {
        id: `${this.playerFireId}-${trigger.timestamp}`,
        shotTime: this.revealedTimestamp ? trigger.timestamp - this.revealedTimestamp : null,
        targetRole: this.currRole,
        targetIndex: this.currRound,
        timestamp: trigger.timestamp,
        userFireId: this.playerFireId,
        userName: this.players.find((p) => p.fireId === this.playerFireId).name,
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
        const sortedShots = shots
          .filter((s) => s.targetIndex === this.currRound)
          .sort((a, b) => a.shotTime - b.shotTime);
        const latestShot = sortedShots[sortedShots.length - 1];
        if (latestShot) {
          this.triggerShotAnimation(latestShot);
          this.shotNotification.pushShots(sortedShots);
        }
      });
  }

  private triggerShotAnimation(shot: Shot) {
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

  isPlayerDead(playerFireId: string): boolean {
    return this.getLifepoints(playerFireId) <= 0;
  }

  private drawRipple(x, y) {
    const node = document.querySelector('.ripple');
    const newNode: any = node.cloneNode(true);
    newNode.classList.add('animate');
    newNode.style.left = x - 5 + 'px';
    newNode.style.top = y - 5 + 'px';
    node.parentNode.replaceChild(newNode, node);
  }

  private triggerWinnerAnimation() {
    this.winners = this.shootTheBurglar.getWinners(this.players, this.scoresMap);
  }
}
