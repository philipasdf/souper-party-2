import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { GAME_PATH, PARTY_PATH } from './firestore-paths';
import { Game } from '../models/game.model';

@Injectable({ providedIn: 'root' })
export class GameFsService {

    constructor(private afs: AngularFirestore) {}

    addGame(partyName: string, game: Game) {
        return this.afs.collection(`${PARTY_PATH}/${partyName}/${GAME_PATH}`)
        .add(JSON.parse(JSON.stringify(game)));
    }

}