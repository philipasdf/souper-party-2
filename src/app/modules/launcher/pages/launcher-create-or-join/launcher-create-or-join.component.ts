import { Component, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { createParty, FAILED, joinParty } from 'src/app/shared/actions/party.actions';

@Component({
  selector: 'app-launcher-create-or-join',
  templateUrl: './launcher-create-or-join.component.html',
  styleUrls: ['./launcher-create-or-join.component.css']
})
export class LauncherCreateOrJoinComponent implements OnInit {

  partyNameInput: string; 

  constructor(private store: Store, private actions: Actions) { }

  ngOnInit(): void {
    this.actions
      .pipe(ofType(FAILED))
      .subscribe(action => console.log(action));
  }

  create() {
    this.store.dispatch(createParty( { name: this.partyNameInput}));
  }

  join() {
    this.store.dispatch(joinParty( { name: this.partyNameInput }));
  }

}
