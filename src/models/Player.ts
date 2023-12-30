import { IdGenerator } from '../utils/IdGenerator';
import { Comparable } from '../core/Comparable';
import { PlayerDto } from '@scoparella/dtos';

export class Player implements Comparable {
  private _id: string;
  constructor(id?: string) {
    this._id = id || IdGenerator.generateId();
  }
  get id() {
    return this._id;
  }

  equals(other: Player) {
    return this._id === other._id;
  }

  static fromDto(jsonObj: PlayerDto): Player {
    const player = new Player();
    player._id = jsonObj.id;
    return player;
  }

  static toDto(obj: Player): PlayerDto {
    return {
      id: obj.id,
    };
  }
}
