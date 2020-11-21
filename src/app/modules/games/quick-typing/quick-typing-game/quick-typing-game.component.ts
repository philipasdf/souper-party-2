import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { queryGames } from 'src/app/shared/actions/game.actions';
import { queryParty } from 'src/app/shared/actions/party.actions';
import { queryPlayers } from 'src/app/shared/actions/player.actions';
import { selectCurrGame } from 'src/app/shared/reducers/game.reducer';
import { GameCountdownService } from '../../game-countdown/game-countdown.service';
import { QuickTypingData } from '../quick-typing-data';

@Component({
  selector: 'app-quick-typing-game',
  templateUrl: './quick-typing-game.component.html',
  styleUrls: ['./quick-typing-game.component.css'],
})
export class QuickTypingGameComponent implements OnInit {
  data: QuickTypingData;
  text: any[] = [];
  typedText: string;
  score = 0;
  EMPTY = '';
  CORRECT = 'correct';
  WRONG = 'wrong';

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
        this.text = Array.from(this.data.textToType).map((t) => ({ char: t, status: this.EMPTY }));
      }
    });
  }

  onTextInput(input) {
    const inputArray = Array.from(input);

    for (let i = 0; i < inputArray.length; i++) {
      const isCorrect = this.text[i].char === inputArray[i];
      this.text[i].status = isCorrect ? this.CORRECT : this.WRONG;
    }
  }

  calculateScore() {
    const corrects = this.text.filter((t) => t.status === this.CORRECT).length;
    const wrongs = this.text.filter((t) => t.status === this.WRONG).length;
    this.score = corrects - wrongs;
  }
}
