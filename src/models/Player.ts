import { IdGenerator } from "../utils/IdGenerator"

export class Player {
    private _id: string;
    constructor() {
        this._id = IdGenerator.generateId();
    }
    get id() {
        return this._id;
    }

    equals(other: Player) {
        return this._id === other.id;
    }
}