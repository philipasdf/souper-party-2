import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { queryGames } from 'src/app/shared/actions/game.actions';
import { queryParty } from 'src/app/shared/actions/party.actions';
import { queryPlayers } from 'src/app/shared/actions/player.actions';
import { selectCurrGame } from 'src/app/shared/reducers/game.reducer';
import { GameCountdownService } from '../../game-countdown/game-countdown.service';
import { ShootTheBurglarData } from '../shoot-the-burglar-data';

@Component({
  selector: 'app-shoot-the-burglar-game',
  templateUrl: './shoot-the-burglar-game.component.html',
  styleUrls: ['./shoot-the-burglar-game.component.css'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class ShootTheBurglarGameComponent implements OnInit {
  data: ShootTheBurglarData;

  constructor(private route: ActivatedRoute, private store: Store, private countdown: GameCountdownService) {}

  ngOnInit() {
    this.countdown.startCountdown();

    const partyName = this.route.snapshot.params['partyName'];
    const playerFireId = this.route.snapshot.params['playerFireId'];
    this.store.dispatch(queryParty({ name: partyName }));
    this.store.dispatch(queryPlayers({ party: partyName }));
    this.store.dispatch(queryGames({ partyName })); // TODO query only one game

    this.store.select(selectCurrGame).subscribe((game) => {
      console.log(game);
      this.data = game?.gameData?.data;
      if (this.data) {
        // TODO
      }
    });
  }

  onClick(event) {
    console.log(event);
  }
}
