import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Shot } from '../../models/shot.model';

@Injectable({
  providedIn: 'root',
})
export class ShotNotificationService {
  princessNotifications$ = new Subject();
  burglarNotifications$ = new Subject();
  clearNotifications$ = new Subject();

  constructor() {}

  pushShots(shots: Shot[]) {
    const currRole = shots[0].targetRole;

    if (currRole === 'princess') {
      this.princessNotifications$.next(shots);
    }

    if (currRole === 'burglar') {
      this.burglarNotifications$.next(shots);
    }
  }

  clearList() {
    this.clearNotifications$.next();
  }
}
