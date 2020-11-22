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
import { ShootTheBurglarData } from '../../shoot-the-burglar-data';

@Component({
  selector: 'app-shoot-the-burglar-preparer',
  templateUrl: './shoot-the-burglar-preparer.component.html',
})
export class ShootTheBurglarPreparerComponent implements OnInit, OnDestroy {
  gameSuccess$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private store: Store,
    private actions$: Actions,
    private router: Router
  ) {}

  ngOnInit(): void {
    const partyName = this.route.snapshot.params['partyName'];
    const hostFireId = this.route.snapshot.params['hostFireId'];
    const gameIndex = this.route.snapshot.params['gameIndex'];

    const party: Party = { name: partyName, host: '', hostFireId: hostFireId };
    this.store.dispatch(updateParty({ party }));

    const gameData: GameData<ShootTheBurglarData> = {
      name: 'shoot-the-burglar',
      data: {
        textToType: '',
        rounds: [
          {
            reveal: 'burglar',
            timeUntilReveal: 1000,
          },
          {
            reveal: 'princess',
            timeUntilReveal: 2300,
          },
          {
            reveal: 'burglar',
            timeUntilReveal: 3000,
          },
          {
            reveal: 'princess',
            timeUntilReveal: 2000,
          },
          {
            reveal: 'princess',
            timeUntilReveal: 500,
          },
          {
            reveal: 'burglar',
            timeUntilReveal: 4000,
          },
        ],
      },
    };

    this.gameService.createGame(partyName, gameData, gameIndex);

    // TODO move to a better place
    this.gameSuccess$ = this.actions$.pipe(ofType(SUCCESS)).subscribe(() => {
      this.router.navigate([`lobby/${partyName}/${hostFireId}`]);
    });
  }

  ngOnDestroy() {
    this.gameSuccess$.unsubscribe();
  }
}
