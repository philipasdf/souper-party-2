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

    loadGamePreparer(partyName: string, hostFireId: string, gameName: string, gameIndex: number) {
        this.router.navigate([`${gameName}/prepare-data/${partyName}/${hostFireId}/${gameIndex}`]);
    }

    createGame(partyName: string, gameData: GameData, index: number) {

        const game: Game = {
            id: gameData.name,
            index: index,
            state: 'initial-state',
            gameData: gameData
        }

        this.store.dispatch(createGame({ game, partyName }));
    }

}