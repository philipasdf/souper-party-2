import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as playerActions from 'src/app/shared/actions/player.actions';
import * as playerReducer from 'src/app/shared/reducers/player.reducer';

@Component({
  selector: 'app-launcher-home',
  templateUrl: './launcher-home.component.html',
  styleUrls: ['./launcher-home.component.css'],
})
export class LauncherHomeComponent implements OnInit {
  _nameInput = '';

  constructor(private playerStore: Store<playerReducer.State>) {}

  ngOnInit(): void {
    this.playerStore.select(playerReducer.selectCurrPlayerName).subscribe((currPlayer) => {
      this.nameInput = currPlayer;
    });
  }

  saveUser() {
    this.playerStore.dispatch(playerActions.saveCurrPlayer({ currPlayer: this.nameInput.trim() }));
  }

  get nameInput() {
    return this._nameInput;
  }

  set nameInput(input: string) {
    this._nameInput = input.toUpperCase();
  }
}
