import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Player } from 'src/app/shared/models/player.model';
import { Shot } from '../../models/shot.model';

@Injectable({ providedIn: 'root' })
export class ShootTheBurglarService {
  MAX_LIFEPOINTS = 3;

  constructor(private store: Store) {}

  calculateScores(shots: Shot[], currRound: number): Map<string, number> {
    const scoresMap = new Map();

    for (let i = 0; i < currRound; i++) {
      let fastestShotTime = -1;
      const currShots = shots.filter((s) => s.targetIndex === i + 1 && s.targetRole === 'burglar');

      currShots.forEach((s) => {
        if (s.shotTime < fastestShotTime || fastestShotTime === -1) {
          fastestShotTime = s.shotTime;
        }
      });

      currShots
        .filter((s) => s.shotTime === fastestShotTime)
        .forEach((s) => {
          const currScore = this.getScore(s.userFireId, scoresMap);
          scoresMap.set(s.userFireId, currScore + 1);
        });
    }

    return scoresMap;
  }

  getScore(playerFireId: string, scoresMap: Map<string, number>): number {
    return scoresMap?.get(playerFireId) == null ? 0 : scoresMap.get(playerFireId);
  }

  calculateLifepoints(shots: Shot[], players: Player[]): Map<string, number> {
    const lifepointsMap = new Map();
    players.forEach((p) => {
      const princessHits = shots.filter((s) => s.targetRole === 'princess' && s.userFireId === p.fireId).length;
      lifepointsMap.set(p.fireId, this.MAX_LIFEPOINTS - princessHits);
    });
    return lifepointsMap;
  }

  getLifepoints(playerFireId: string, lifepointsMap: Map<string, number>) {
    const result = lifepointsMap?.get(playerFireId) == null ? this.MAX_LIFEPOINTS : lifepointsMap.get(playerFireId);
    return Math.max(result, 0);
  }
}
