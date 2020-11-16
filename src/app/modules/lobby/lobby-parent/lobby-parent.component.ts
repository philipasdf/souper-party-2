import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { queryGames } from 'src/app/shared/actions/game.actions';
import { queryParty } from 'src/app/shared/actions/party.actions';
import { queryPlayers } from 'src/app/shared/actions/player.actions';
import { UnsubscribingComponent } from 'src/app/shared/components/unsubscribing/unsubscribing.component';

@Component({
  selector: 'app-lobby-parent',
  templateUrl: './lobby-parent.component.html',
  styleUrls: ['./lobby-parent.component.css']
})
export class LobbyParentComponent extends UnsubscribingComponent implements OnInit {

  partyName = '';
  playerFireId = '';

  constructor(protected route: ActivatedRoute, 
    protected store: Store) { 
                  super();
  }

  ngOnInit() {
    this.partyName = this.route.snapshot.params['partyName'];
    this.playerFireId = this.route.snapshot.params['playerFireId'];

    this.store.dispatch(queryParty({name: this.partyName}));
    this.store.dispatch(queryPlayers({party: this.partyName}));
    this.store.dispatch(queryGames({partyName: this.partyName}));
  }

}
