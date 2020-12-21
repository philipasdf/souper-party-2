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

  pushShot(name: string, shot: Shot) {
    if (shot.targetRole === 'princess') {
      this.princessNotifications$.next({ name, shot });
    }

    if (shot.targetRole === 'burglar') {
      this.burglarNotifications$.next({ name, shot });
    }
  }

  clearList() {
    this.clearNotifications$.next();
  }
}
