import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';
import { QuickTypingGame } from '../quick-typing.game';
import { GameData } from '../../game-data';

@Component({
  selector: 'app-quick-typing-preparer',
  templateUrl: './quick-typing-preparer.component.html'
})
export class QuickTypingPreparerComponent implements OnInit {

  constructor(private route: ActivatedRoute, private gameService: GameService) { }

  ngOnInit(): void {
    const partyName = this.route.snapshot.params['partyName'];
    const hostFireId = this.route.snapshot.params['hostFireId'];


    const gameData: GameData = new QuickTypingGame('Lorem Ipsum bla');


    this.gameService.createGame(partyName, hostFireId, gameData);
  }

}
