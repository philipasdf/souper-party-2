import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { createParty, FAILED, joinParty } from 'src/app/shared/actions/party.actions';

@Component({
  selector: 'app-launcher-create-or-join',
  templateUrl: './launcher-create-or-join.component.html',
  styleUrls: ['./launcher-create-or-join.component.css']
})
export class LauncherCreateOrJoinComponent implements OnInit, OnDestroy {

  partyNameInput: string; 
  errorMessage: string;

  constructor(private store: Store, private actions: Actions) { }

  errorMsgs$;

  ngOnInit(): void {
    this.errorMsgs$ = this.actions
      .pipe(ofType(FAILED))
      .subscribe((action: any) => {
        this.errorMessage = action.errorMessage;
      });
  }

  ngOnDestroy() {
    this.errorMsgs$.unsubscribe();
  }

  create() {
    this.store.dispatch(createParty( { name: this.partyNameInput}));
  }

  join() {
    this.store.dispatch(joinParty( { name: this.partyNameInput }));
  }

}
