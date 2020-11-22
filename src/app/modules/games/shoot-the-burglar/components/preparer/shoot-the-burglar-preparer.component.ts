import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { SUCCESS } from 'src/app/shared/actions/game.actions';
import { updateParty } from 'src/app/shared/actions/party.actions';
import { Party } from 'src/app/shared/models/party.model';
import { GameData } from '../../../game-data';
import { GameService } from '../../../services/game.service';
import { ShootTheBurglarData, ShootTheBurglarRound } from '../../shoot-the-burglar-data';

@Component({
  selector: 'app-shoot-the-burglar-preparer',
  templateUrl: './shoot-the-burglar-preparer.component.html',
})
export class ShootTheBurglarPreparerComponent implements OnInit, OnDestroy {
  MIN_REVEAL_TIME = 250;
  MAX_REVEAL_TIME = 2750;
  MAX_STAY_TIME = 2000;
  MIN_STAY_TIME = 500;
  gameSuccess$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private store: Store,
    private actions$: Actions,
    private router: Router
  ) {}

  ngOnDestroy() {
    this.gameSuccess$.unsubscribe();
  }

  ngOnInit(): void {
    const partyName = this.route.snapshot.params['partyName'];
    const hostFireId = this.route.snapshot.params['hostFireId'];
    const gameIndex = this.route.snapshot.params['gameIndex'];

    const party: Party = { name: partyName, host: '', hostFireId: hostFireId };
    this.store.dispatch(updateParty({ party }));

    const gameData: GameData<ShootTheBurglarData> = {
      name: 'shoot-the-burglar',
      data: {
        rounds: this.initRounds(5),
      },
    };

    this.gameService.createGame(partyName, gameData, gameIndex);

    // TODO move to a better place
    this.gameSuccess$ = this.actions$.pipe(ofType(SUCCESS)).subscribe(() => {
      this.router.navigate([`lobby/${partyName}/${hostFireId}`]);
    });
  }

  initRounds(numOfRounds: number): ShootTheBurglarRound[] {
    const rounds = [];
    for (let i = 0; i < numOfRounds; i++) {
      rounds.push({
        reveal: this.getRndReveal(['burglar', 'princess']),
        timeUntilReveal: this.getRndTime(this.MIN_REVEAL_TIME, this.MAX_REVEAL_TIME),
        stayTime: this.getRndTime(this.MIN_STAY_TIME, this.MAX_STAY_TIME),
      });
    }
    return rounds;
  }

  private getRndReveal(reveals: any[]): string {
    return reveals[Math.floor(Math.random() * reveals.length)];
  }

  private getRndTime(min: number, max: number) {
    return Math.floor(Math.random() * max) + min;
  }
}
