import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { QuickTypingData } from '../quick-typing-data';
import { GameData } from '../../game-data';
import { Actions, ofType } from '@ngrx/effects';
import { CREATE_SUCCESS } from 'src/app/shared/actions/game.actions';

@Component({
  selector: 'app-quick-typing-preparer',
  templateUrl: './quick-typing-preparer.component.html'
})
export class QuickTypingPreparerComponent implements OnInit {

  constructor(private route: ActivatedRoute, private gameService: GameService, private actions$: Actions, private router: Router) { }

  ngOnInit(): void {
    const partyName = this.route.snapshot.params['partyName'];
    const hostFireId = this.route.snapshot.params['hostFireId'];
    const gameIndex = this.route.snapshot.params['gameIndex'];


    const gameData: GameData<QuickTypingData> = {
      name: 'quick-typing',
      data: {
        textToType: 'Lorem Ipsum bla bla'
      }
    }

    this.gameService.createGame(partyName, gameData, gameIndex);




    // TODO move this somewhere else
    this.actions$
      .pipe(ofType(CREATE_SUCCESS))
      .subscribe(() => {

        // dispatch store set all players state action

          this.router.navigate([`lobby/${partyName}/${hostFireId}`]);
      });
  }

}
