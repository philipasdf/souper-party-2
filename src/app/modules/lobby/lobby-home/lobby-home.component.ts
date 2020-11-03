import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { queryParty } from 'src/app/shared/actions/party.actions';
import { queryPlayers } from 'src/app/shared/actions/player.actions';
import { selectParty } from 'src/app/shared/reducers/party.reducer';
import * as players from 'src/app/shared/reducers/player.reducer';

@Component({
  selector: 'app-lobby-home',
  templateUrl: './lobby-home.component.html',
  styleUrls: ['./lobby-home.component.css']
})
export class LobbyHomeComponent implements OnInit, OnDestroy {

  party$;
  players$;
  partyName = '';
  playerFireId = '';

  constructor(private route: ActivatedRoute, private store: Store) { }

  ngOnInit(): void {
    this.partyName = this.route.snapshot.params['partyName'];
    this.playerFireId = this.route.snapshot.params['playerFireId'];

    this.store.dispatch(queryParty({name: this.partyName}));
    this.party$ = this.store.select(selectParty);

    this.store.dispatch(queryPlayers({party: this.partyName}));
    this.players$ = this.store.select(players.selectEntities);
  }

  ngOnDestroy() {
  }
}
