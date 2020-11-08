import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { createGame } from 'src/app/shared/actions/game.actions';
import { Game } from 'src/app/shared/models/game.model';
import { GameData } from '../game-data';

@Injectable({ providedIn: 'root' })
export class GameService {

    constructor(private router: Router, private store: Store) {

    }

    loadGamePreparer(partyName: string, hostFireId: string, gameName: string) {
        this.router.navigate([`${gameName}/prepare-data/${partyName}/${hostFireId}`]);
    }

    createGame(partyName: string, hostFireId: string, gameData: GameData) {

        this.store.dispatch(createGame({ gameData }));
        // dispatch store game action
        // dispatch store set all players state action

        // this.router.navigate([`lobby/${partyName}/${hostFireId}`])
    }

}