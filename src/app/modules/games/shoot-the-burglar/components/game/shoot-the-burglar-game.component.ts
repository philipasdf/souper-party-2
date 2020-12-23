import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subject, timer } from 'rxjs';
import { filter, takeUntil, tap, timestamp, withLatestFrom } from 'rxjs/operators';
import * as shots from 'src/app/modules/games/shoot-the-burglar/reducers/shot.reducer';
import { queryGames } from 'src/app/shared/actions/game.actions';
import { queryParty, setPartyStep } from 'src/app/shared/actions/party.actions';
import { incrementPlayerPoints, queryPlayers, setPlayerStep } from 'src/app/shared/actions/player.actions';
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
import { IDLE, GAME_OVER } from 'src/app/shared/steps/steps';
import { selectPartyHost } from 'src/app/shared/reducers/party.reducer';

@Component({
  selector: 'app-shoot-the-burglar-game',
  templateUrl: './shoot-the-burglar-game.component.html',
  styleUrls: ['./shoot-the-burglar-game.component.css'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class ShootTheBurglarGameComponent extends UnsubscribingComponent implements OnInit {
  partyName: string;
  playerFireId: string;
  gameFireId: string;
  data: ShootTheBurglarData;
  RESPONSIVE_WIDTH = 0;

  preloadImgs = [];
  countdownEnded$ = new Subject();
  triggerShot$ = new Subject();
  players$: Observable<Player[]>;
  players: Player[];
  playerScores: { fireId: string }[] = []; // score: if you shot a burglar first, you earn one score

  currRound = 1;
  currRole = null;
  revealedId = null;
  revealedImg = null;
  scoresMap: Map<string, number>;
  lifepointsMap: Map<string, number>;
  revealedTimestamp: number;
  winners: Player[] = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

    this.partyName = this.route.snapshot.params['partyName'];
    this.gameFireId = this.route.snapshot.params['gameFireId'];
    this.playerFireId = this.route.snapshot.params['playerFireId'];
    this.store.dispatch(queryParty({ name: this.partyName }));
    this.store.dispatch(queryPlayers({ party: this.partyName }));
    this.store.dispatch(queryGames({ partyName: this.partyName }));
    this.store.dispatch(queryShots({ partyName: this.partyName, gameFireId: this.gameFireId }));

    this.players$ = this.store.select(players.selectAll).pipe(
      takeUntil(this.unsub$),
      tap((players) => (this.players = players))
    );

    combineLatest(this.store.select(selectCurrGame), this.countdownEnded$)
      .pipe(filter(([game, countdownEnded]) => !!game && !!countdownEnded))
      .subscribe(([game, _]) => {
        this.data = game?.gameData?.data;
        this.revealBurglarsAndPrincesses();
      });

    this.processTriggers();
    this.processShots();

    this.hostStepProcessing();
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

  private processTriggers() {
    this.triggerShot$.pipe(timestamp()).subscribe((trigger: { value: MouseEvent; timestamp: number }) => {
      const shot: Shot = {
        id: `${this.playerFireId}-${trigger.timestamp}`,
        shotTime: this.revealedTimestamp ? trigger.timestamp - this.revealedTimestamp : null,
        targetRole: this.currRole,
        targetIndex: this.currRound,
        timestamp: trigger.timestamp,
        userFireId: this.playerFireId,
        userName: this.getPlayer(this.playerFireId).name,
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
        const currShots = this.shootTheBurglar.getCurrShots(shots, this.currRound);
        const latestShot = currShots[currShots.length - 1];
        if (latestShot) {
          this.triggerShotAnimation(latestShot);
          this.shotNotification.pushShots(currShots);
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

  private getPlayerAvatar(fireId: string): string {
    return this.getPlayer(fireId).avatarUrl;
  }

  private getPlayer(fireId: string): Player {
    return this.players.find((p) => p.fireId === fireId);
  }

  private gameOver() {
    this.triggerWinnerAnimation();
    timer(5000)
      .toPromise()
      .then(() => {
        const player = this.getPlayer(this.playerFireId);
        this.store.dispatch(setPlayerStep({ player, step: GAME_OVER }));
      });
  }

  private hostStepProcessing() {
    this.players$
      .pipe(
        takeUntil(this.unsub$),
        filter((players) => !!players && players.length > 0),
        withLatestFrom(this.store.select(selectPartyHost)),
        tap(([players, partyHost]) => {
          // all players have ended the game
          if (players.every((p) => p.step.step === GAME_OVER.step)) {
            // host sets step and updates score
            const currPlayerName = this.getPlayer(this.playerFireId).name;
            const isHost = partyHost === currPlayerName;
            if (isHost) {
              this.winners.forEach((w) => this.store.dispatch(incrementPlayerPoints({ player: w })));
              this.store.dispatch(setPartyStep({ partyName: this.partyName, step: IDLE }));
            }
            this.router.navigate([`lobby/${this.partyName}/${this.playerFireId}`]);
          }
        })
      )
      .subscribe();
  }
}
