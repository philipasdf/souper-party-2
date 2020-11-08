import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { queryParty } from 'src/app/shared/actions/party.actions';
import { queryPlayers } from 'src/app/shared/actions/player.actions';
import { selectParty } from 'src/app/shared/reducers/party.reducer';
import * as players from 'src/app/shared/reducers/player.reducer';
import { GameService } from '../../games/services/game.service';

@Component({
  selector: 'app-lobby-home',
  templateUrl: './lobby-home.component.html',
  styleUrls: ['./lobby-home.component.css']
})
export class LobbyHomeComponent implements OnInit, OnDestroy {

  currPlayer$;
  party$;
  players$;
  partyName = '';
  playerFireId = '';

  constructor(private route: ActivatedRoute, private store: Store, private gameService: GameService) { }

  ngOnInit(): void {
    this.partyName = this.route.snapshot.params['partyName'];
    this.playerFireId = this.route.snapshot.params['playerFireId'];

    this.store.dispatch(queryParty({name: this.partyName}));
    this.party$ = this.store.select(selectParty);

    this.store.dispatch(queryPlayers({party: this.partyName}));
    this.players$ = this.store.select(players.selectAll);

    this.currPlayer$ = this.store.select(players.selectCurrPlayer);

    // inject stateManager
    // if this is the host, then activate stateManager

    // stateManager PLAYER
    // subscribe to store.select(myplayer) 
    // => if state(read-game-guide-and-check-in-game)
    //      router.navigate('lobby-game-guide/gameId')


    /**
     * State Manager Host
     * 
     * if party state ('wait-for-players-to-check-in-game')
     *    iterate all players and check if all have state 'ready-for-the-game'
     *    dispatch(navigatePlayersToGame(game))
     *    update all players ({state: 'playing-game'})
     */
  }

  ngOnDestroy() {
  }

  onStartGame() {
    // create game
    // prepare data
    // ??? party.state = 'wait-for-players-t ???
    // service.createGameWithData
    // store.dispatch(navigatePlayersToGameGuidePage(game))
    // update all players ({state: 'read-game-guide-and-check-in-game'})
    this.gameService.loadGamePreparer(this.partyName, this.playerFireId, 'quick-typing');
  }
}
