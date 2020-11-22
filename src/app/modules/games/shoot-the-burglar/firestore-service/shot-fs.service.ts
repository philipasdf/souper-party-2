import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { GAME_PATH, PARTY_PATH } from 'src/app/shared/firestore-services/firestore-paths';
import { Shot } from '../models/shot.model';

@Injectable({ providedIn: 'root' })
export class ShotFsService {
  constructor(private afs: AngularFirestore) {}

  addShot(partyName: string, gameId: string, shot: Shot) {
    return this.afs.collection(`${PARTY_PATH}/${partyName}/${GAME_PATH}/${gameId}/shots`).add(shot);
  }

  fetchShots(partyName: string, gameId: string) {
    const path = `${PARTY_PATH}/${partyName}/${GAME_PATH}/${gameId}/shots`;
    return this.afs.collection(path, (ref) => ref.orderBy('timestamp', 'asc')).valueChanges();
  }
}
