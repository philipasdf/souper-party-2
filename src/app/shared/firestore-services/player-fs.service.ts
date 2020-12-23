import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { PARTY_PATH, PLAYER_PATH } from './firestore-paths';
import { Player } from '../models/player.model';
import { Step } from '../steps/step';

@Injectable({ providedIn: 'root' })
export class PlayerFsService {
  constructor(private afs: AngularFirestore) {}

  checkIfPlayerExists(partyName: string, playerName: string) {
    return this.getPlayerRef(partyName, playerName).get();
  }

  createPlayer(partyName: string, player: Player) {
    return from(this.afs.doc(`${PARTY_PATH}/${partyName}/${PLAYER_PATH}/${player.name}`).set(player));
  }

  fetchPlayers(partyName: string) {
    return this.afs.collection(`${PARTY_PATH}/${partyName}/${PLAYER_PATH}`).valueChanges();
  }

  setStep(partyName: string, playerName: string, step: Step) {
    // console.log(`%c SERVICE: setStep -> ${playerName} -> ${step.step} -> ${step.done}`, 'color: green');
    const ref = this.getPlayerRef(partyName, playerName);
    return from(ref.update({ step }));
  }

  setAvatar(partyName: string, playerName: string, avatar: string, avatarUrl: string) {
    const ref = this.getPlayerRef(partyName, playerName);
    return from(ref.update({ avatar, avatarUrl }));
  }

  incrementPoints(partyName: string, player: Player) {
    const ref = this.getPlayerRef(partyName, player.name);
    const points = player.points + 1;
    return from(ref.update({ points }));
  }

  private getPlayerRef(partyName: string, playerName: string) {
    return this.afs.doc<Player>(`${PARTY_PATH}/${partyName}/${PLAYER_PATH}/${playerName}`);
  }
}
