import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { exhaustMap, filter, takeUntil } from 'rxjs/operators';
import { SUCCESS } from 'src/app/shared/actions/game.actions';
import { updateParty } from 'src/app/shared/actions/party.actions';
import { queryPlayers } from 'src/app/shared/actions/player.actions';
import { UnsubscribingComponent } from 'src/app/shared/components/unsubscribing/unsubscribing.component';
import { Party } from 'src/app/shared/models/party.model';
import { Player } from 'src/app/shared/models/player.model';
import { selectAll } from 'src/app/shared/reducers/player.reducer';
import { GameData } from '../../../game-data';
import { GameService } from '../../../services/game.service';
import { ShootTheBurglarData, ShootTheBurglarReveal, ShootTheBurglarRound } from '../../shoot-the-burglar-data';
import { REVEALED_CONFIGS } from '../revealed/revealed-configs';

@Component({
  selector: 'app-shoot-the-burglar-preparer',
  templateUrl: './shoot-the-burglar-preparer.component.html',
})
export class ShootTheBurglarPreparerComponent extends UnsubscribingComponent implements OnInit, OnDestroy {
  MIN_REVEAL_TIME = 250;
  MAX_REVEAL_TIME = 2750;
  MAX_STAY_TIME = 2000;
  MIN_STAY_TIME = 500;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private store: Store,
    private actions$: Actions,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    const partyName = this.route.snapshot.params['partyName'];
    const hostFireId = this.route.snapshot.params['hostFireId'];
    const gameIndex = this.route.snapshot.params['gameIndex'];

    const party: Party = { name: partyName, host: '', hostFireId: hostFireId };
    this.store.dispatch(updateParty({ party }));

    this.store.dispatch(queryPlayers({ party: partyName }));
    this.store
      .select(selectAll)
      .pipe(
        takeUntil(this.unsub$),
        filter((players) => players.length > 0),
        exhaustMap((players) => {
          const gameData: GameData<ShootTheBurglarData> = this.createGameData(players);

          this.gameService.createGame(partyName, gameData, gameIndex);

          // TODO move to a better place
          return this.actions$.pipe(takeUntil(this.unsub$), ofType(SUCCESS));
        })
      )
      .subscribe(() => {
        this.router.navigate([`lobby/${partyName}/${hostFireId}`]);
      });
  }

  private createGameData(players: Player[]): GameData<ShootTheBurglarData> {
    const burglarsAndPrincesses = this.createBurglarsAndPrincesses(players);
    return {
      name: 'shoot-the-burglar',
      data: {
        rounds: this.initRounds(15, burglarsAndPrincesses),
      },
    };
  }

  private createBurglarsAndPrincesses(players: Player[]): ShootTheBurglarReveal[] {
    if (players.length === 1) {
      return [
        { playerFireId: players[0].fireId, role: 'burglar' },
        { playerFireId: players[0].fireId, role: 'princess' },
      ];
    }

    const burglarsAndPrincesses = this.shuffleArray(players).map((player, index) => ({
      playerFireId: player.fireId,
      role: this.isBurglar(index, players.length) ? 'burglar' : 'princess',
    }));
    return this.shuffleArray(burglarsAndPrincesses);
  }

  private initRounds(numOfRounds: number, burglarsAndPrincesses: ShootTheBurglarReveal[]): ShootTheBurglarRound[] {
    const rounds: ShootTheBurglarRound[] = [];
    for (let i = 0; i < numOfRounds; i++) {
      const reveal =
        i < burglarsAndPrincesses.length ? burglarsAndPrincesses[i] : this.getRndFromArray(burglarsAndPrincesses);
      rounds.push({
        revealedId: this.getRandomRevealId(reveal.role),
        reveal,
        timeUntilReveal: this.getRndTime(this.MIN_REVEAL_TIME, this.MAX_REVEAL_TIME),
        stayTime: this.getRndTime(this.MIN_STAY_TIME, this.MAX_STAY_TIME),
      });
    }
    return rounds;
  }

  private getRandomRevealId(role: string): string {
    const filteredReveals = REVEALED_CONFIGS.filter((r) => r.role === role);
    return this.getRndFromArray(filteredReveals).revealedId;
  }

  private getRndFromArray(arr: any[]): any {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private getRndTime(min: number, max: number) {
    return Math.floor(Math.random() * max) + min;
  }

  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  /**
   * From all shuffled players the first half are burglars. The other half are princesses.
   * @param playerIndex
   * @param numberOfPlayers
   */
  private isBurglar(playerIndex: number, numberOfPlayers: number): boolean {
    const median = Math.floor(numberOfPlayers / 2);

    if (playerIndex < median) {
      return true;
    } else {
      return false;
    }
  }
}
