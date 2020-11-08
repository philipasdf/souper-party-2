import { createAction, props } from '@ngrx/store';
import { GameData } from 'src/app/modules/games/game-data';

export const CREATE_GAME = '[Game] create game';

export const createGame = createAction(CREATE_GAME, props<{ gameData: GameData }>());