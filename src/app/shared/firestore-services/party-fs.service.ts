import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { PARTY_PATH } from './firestore-paths';
import { Party } from '../models/party.model';
import { Step } from '../steps/step';

@Injectable({ providedIn: 'root' })
export class PartyFsService {
  constructor(private afs: AngularFirestore) {}

  checkIfPartyExists(partyName: string) {
    return this.afs.doc<Party>(`${PARTY_PATH}/${partyName}`).get();
  }

  createParty(partyName: string, party: Party): Observable<void> {
    return from(this.afs.doc<Party>(`${PARTY_PATH}/${partyName}`).set(party));
  }

  fetchParty(partyName: string) {
    return this.afs.doc<Party>(`${PARTY_PATH}/${partyName}`).valueChanges();
  }

  setStep(partyName: string, step: Step) {
    const ref = this.afs.doc<Party>(`${PARTY_PATH}/${partyName}`);
    return from(ref.update({ step }));
  }

  setCurrGameFireId(partyName: string, currGameIndex: number) {
    const ref = this.afs.doc<Party>(`${PARTY_PATH}/${partyName}`);
    return from(ref.update({ currGameIndex }));
  }
}
