import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { PARTY_PATH, PLAYER_PATH } from './firestore-paths';
import { Player } from '../models/player.model';

@Injectable({ providedIn: 'root' })
export class PlayerFsService {

    constructor(private afs: AngularFirestore) {}

    checkIfPlayerExists(partyName: string, playerName: string) {
        return this.afs.doc(`${PARTY_PATH}/${partyName}/${PLAYER_PATH}/${playerName}`).get();
    }

    createPlayer(partyName: string, player: Player) {
        return from(this.afs.doc(`${PARTY_PATH}/${partyName}/${PLAYER_PATH}/${player.name}`).set(player))
    }

    fetchPlayers(partyName: string) {
        return this.afs.collection(`${PARTY_PATH}/${partyName}/${PLAYER_PATH}`).valueChanges();
    }
}