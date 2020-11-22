import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { GAME_PATH, PARTY_PATH } from './firestore-paths';
import { Game } from '../models/game.model';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameFsService {
  constructor(private afs: AngularFirestore) {}

  createGame(partyName: string, game: Game): Observable<void> {
    return from(
      this.afs.doc(`${PARTY_PATH}/${partyName}/${GAME_PATH}/${game.index}`).set(JSON.parse(JSON.stringify(game)))
    );
  }

  fetchGames(partyName: string) {
    return this.afs.collection(`${PARTY_PATH}/${partyName}/${GAME_PATH}`).valueChanges();
  }
}
