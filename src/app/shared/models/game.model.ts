import { GameData } from 'src/app/modules/games/game-data';

export interface Game {
  id: string;
  index: number;
  state: string;
  gameData: GameData<any>;
}
