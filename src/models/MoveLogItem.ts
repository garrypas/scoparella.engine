import { Card } from "./Card"
import { Player } from "./Player";
import { IMoveLogItemDto } from "../dtos/IMoveLogItemDto";

export class MoveLogItem {
    private _card: Card;
    private _taken: Card[];
    private _timestamp: string;
    private _player: Player;
    private _isScopa: boolean;

    constructor(
        card: Card,
        taken: Card[],
        timestamp: string,
        player: Player,
        isScopa: boolean
    ) {
        this._card = card;
        this._taken = taken.slice();
        this._timestamp = timestamp;
        this._player = player;
        this._isScopa = isScopa;
    }

    get card(): Card { return this._card; }
    get taken(): Card[] { return this._taken.slice(); }
    get timestamp(): string { return this._timestamp; }
    get player(): Player { return this._player; }
    get isScopa(): boolean { return this._isScopa; }

    static fromDto(jsonObj: IMoveLogItemDto): MoveLogItem {
        return new MoveLogItem(
            Card.fromDto(jsonObj.card),
            Card.fromDtoArray(jsonObj.taken),
            jsonObj.timestamp,
            Player.fromDto(jsonObj.player),
            jsonObj.isScopa,
        );
    }

    static toDto(obj: MoveLogItem): IMoveLogItemDto {
        return {
            card: Card.toDto(obj._card),
            isScopa: obj._isScopa,
            player: Player.toDto(obj._player),
            taken: Card.toDtoArray(obj._taken),
            timestamp: obj._timestamp,
        };
    }
}