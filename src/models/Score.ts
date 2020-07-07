import { Player } from "./Player";

export class Score {
    private _player: Player;
    private _score: number;


    constructor(player: Player, score: number = 0) {
        this._player = player;
        this._score = score;
    }

    get player(): Player {
        return this._player;
    }

    get score(): number {
        return this._score;
    }

    set score(score: number) {
        this._score = score;
    }
}
