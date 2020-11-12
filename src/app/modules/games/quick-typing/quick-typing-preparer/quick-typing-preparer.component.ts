import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { QuickTypingData } from '../quick-typing-data';
import { GameData } from '../../game-data';
import { On, Store } from '@ngrx/store';
import { queryPlayers } from 'src/app/shared/actions/player.actions';
import { updateParty } from 'src/app/shared/actions/party.actions';
import { Party } from 'src/app/shared/models/party.model';
import { Actions, ofType } from '@ngrx/effects';
import { SUCCESS } from 'src/app/shared/actions/game.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quick-typing-preparer',
  templateUrl: './quick-typing-preparer.component.html'
})
export class QuickTypingPreparerComponent implements OnInit, OnDestroy {

  gameSuccess$: Subscription;

  constructor(private route: ActivatedRoute, 
              private gameService: GameService, 
              private store: Store, 
              private actions$: Actions,
              private router: Router) { }

  ngOnInit(): void {
    const partyName = this.route.snapshot.params['partyName'];
    const hostFireId = this.route.snapshot.params['hostFireId'];
    const gameIndex = this.route.snapshot.params['gameIndex'];


    const party: Party = { name: partyName, host: '', hostFireId: hostFireId };
    this.store.dispatch(updateParty({ party }));

    const gameData: GameData<QuickTypingData> = {
      name: 'quick-typing',
      data: {
        textToType: 'Lorem Ipsum bla bla'
      }
    }

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