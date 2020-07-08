import { IdGenerator } from "../utils/IdGenerator"
import { IComparable } from "../core/IComparable";

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

    static fromObject(jsonObj: Player): Player {
        const player = new Player();
        player._id = jsonObj._id;
        return player;
    }
}