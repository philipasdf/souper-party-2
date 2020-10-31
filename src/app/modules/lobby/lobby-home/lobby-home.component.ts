import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { queryParty } from 'src/app/shared/actions/party.actions';
import { Party } from 'src/app/shared/models/party.model';
import { selectParty } from 'src/app/shared/reducers/party.reducer';

@Component({
  selector: 'app-lobby-home',
  templateUrl: './lobby-home.component.html',
  styleUrls: ['./lobby-home.component.css']
})
export class LobbyHomeComponent implements OnInit, OnDestroy {

  party$;
  partyName = '';
  playerFireId = '';

  constructor(private route: ActivatedRoute, private store: Store<Party>) { }

  ngOnInit(): void {
    this.partyName = this.route.snapshot.params['partyName'];
    this.playerFireId = this.route.snapshot.params['playerFireId'];

    this.store.dispatch(queryParty({name: this.partyName}));
    this.party$ = this.store.select(selectParty);
  }

  ngOnDestroy() {
  }
}
