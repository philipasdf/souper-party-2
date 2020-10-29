import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SAVE_CURR_PLAYER, SUCCESS } from '../actions/player.actions';
import { map } from 'rxjs/operators';
import { CURR_PLAYER_KEY } from '../local-storage-keys';

@Injectable()
export class PlayerEffects {

    @Effect()
    saveCurrPlayer$: Observable<Action> = this.actions$.pipe(
        ofType(SAVE_CURR_PLAYER),
        map( (action: any) => {
            localStorage.setItem(CURR_PLAYER_KEY, action.currPlayer);
            return { type: SUCCESS };
        })
    );

    constructor(private actions$: Actions) {

    }
}