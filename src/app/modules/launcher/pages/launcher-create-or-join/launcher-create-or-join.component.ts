import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { createPartyIfNotAlreadyExists, FAILED, joinPartyIfExists } from 'src/app/shared/actions/party.actions';
import { JOIN_PARTY_SUCCESS } from 'src/app/shared/actions/player.actions';

@Component({
  selector: 'app-launcher-create-or-join',
  templateUrl: './launcher-create-or-join.component.html',
  styleUrls: ['./launcher-create-or-join.component.css'],
})
export class LauncherCreateOrJoinComponent implements OnInit, OnDestroy {
  _partyNameInput = '';

  errorMessage: string;

  constructor(private store: Store, private actions$: Actions, private router: Router) {}

  errorMsgs$;
  joinPartySuccess$;

  ngOnInit(): void {
    this.errorMsgs$ = this.actions$.pipe(ofType(FAILED)).subscribe((action: any) => {
      this.errorMessage = action.errorMessage;
    });
    this.joinPartySuccess$ = this.actions$.pipe(ofType(JOIN_PARTY_SUCCESS)).subscribe((action: any) => {
      this.router.navigateByUrl(`lobby/${action.partyName}/${action.playerFireId}/avatar-creator`);
    });
  }

  ngOnDestroy() {
    this.errorMsgs$.unsubscribe();
    this.joinPartySuccess$.unsubscribe();
  }

  create() {
    this.store.dispatch(createPartyIfNotAlreadyExists({ name: this.partyNameInput.trim() }));
  }

  join() {
    this.store.dispatch(joinPartyIfExists({ name: this.partyNameInput.trim() }));
  }

  get partyNameInput() {
    return this._partyNameInput;
  }

  set partyNameInput(input: string) {
    this._partyNameInput = input.toUpperCase();
  }
}
