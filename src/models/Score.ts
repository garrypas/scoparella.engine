import { Player } from './Player';
import { ScoreDto } from '@scoparella/dtos';

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

  static fromDto(jsonObj: ScoreDto): Score {
    return new Score(Player.fromDto(jsonObj.player), jsonObj.score);
  }

  static toDto(obj: Score): ScoreDto {
    return {
      player: Player.toDto(obj._player),
      score: obj._score,
    };
  }

  static toDtoArray(arr: Score[]): ScoreDto[] {
    return arr.map(this.toDto);
  }
}
