import { GameData } from '../game-data';
export class QuickTypingGame implements GameData {
    name = 'quick-tying';
    data: QuickTypingGameData;

    constructor(data: QuickTypingGameData) {
        this.data = data;
    }
}

export interface QuickTypingGameData {
    textToType: string;
}