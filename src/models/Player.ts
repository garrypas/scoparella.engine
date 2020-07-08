import { IdGenerator } from "../utils/IdGenerator"
import { IComparable } from "../core/IComparable";
import { IPlayerDto } from "../dtos/IPlayerDto";

export class Player implements IComparable {
    private _id: string;
    constructor() {
        this._id = IdGenerator.generateId();
    }
    get id() {
        return this._id;
    }

    equals(other: Player) {
        return this._id === other._id;
    }

    static fromDto(jsonObj: IPlayerDto): Player {
        const player = new Player();
        player._id = jsonObj.id;
        return player;
    }

    static toDto(obj: Player): IPlayerDto {
        return {
            id: obj.id
        };
    }
}