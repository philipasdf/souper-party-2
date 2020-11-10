import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { PARTY_PATH } from './firestore-paths';
import { Party } from '../models/party.model';

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
        return this.afs.doc(`${PARTY_PATH}/${partyName}`).valueChanges();
    }
}