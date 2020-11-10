import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';
import { QuickTypingData } from '../quick-typing-data';
import { GameData } from '../../game-data';
import { Store } from '@ngrx/store';
import { queryPlayers } from 'src/app/shared/actions/player.actions';
import { updateParty } from 'src/app/shared/actions/party.actions';
import { Party } from 'src/app/shared/models/party.model';

@Component({
  selector: 'app-quick-typing-preparer',
  templateUrl: './quick-typing-preparer.component.html'
})
export class QuickTypingPreparerComponent implements OnInit {

  constructor(private route: ActivatedRoute, private gameService: GameService, private store: Store) { }

  ngOnInit(): void {
    const partyName = this.route.snapshot.params['partyName'];
    const hostFireId = this.route.snapshot.params['hostFireId'];
    const gameIndex = this.route.snapshot.params['gameIndex'];


    const party: Party = { name: partyName, host: '', hostFireId: hostFireId };
    this.store.dispatch(updateParty({ party }));
    this.store.dispatch(queryPlayers({party: partyName}));

    const gameData: GameData<QuickTypingData> = {
      name: 'quick-typing',
      data: {
        textToType: 'Lorem Ipsum bla bla'
      }
    }

    this.gameService.createGame(partyName, gameData, gameIndex);
  }

}
