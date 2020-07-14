import { Card } from "./Card"
import { Player } from "./Player";
import { MoveLogItemDto } from "@scoparella/dtos";

export class MoveLogItem {
    private _card: Card | null;
    private _taken: Card[];
    private _timestamp: string;
    private _player: Player;
    private _isScopa: boolean;

    constructor(
        card: Card | null,
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

    get card(): Card | null { return this._card; }
    get taken(): Card[] { return this._taken.slice(); }
    get timestamp(): string { return this._timestamp; }
    get player(): Player { return this._player; }
    get isScopa(): boolean { return this._isScopa; }

    static fromDtoArray(dtoArr: MoveLogItemDto[]): MoveLogItem[] {
        return dtoArr.map(this.fromDto);
    }

    static toDtoArray(arr: MoveLogItem[]): MoveLogItemDto[] {
        return arr.map(this.toDto);
    }

    static fromDto(dtoObj: MoveLogItemDto): MoveLogItem {
        return new MoveLogItem(
            dtoObj.card ? Card.fromDto(dtoObj.card) : null,
            Card.fromDtoArray(dtoObj.taken),
            dtoObj.timestamp,
            Player.fromDto(dtoObj.player),
            dtoObj.isScopa,
        );
    }

    static toDto(obj: MoveLogItem): MoveLogItemDto {
        return {
            card: obj._card ? Card.toDto(obj._card) : null,
            isScopa: obj._isScopa,
            player: Player.toDto(obj._player),
            taken: Card.toDtoArray(obj._taken),
            timestamp: obj._timestamp,
        };
    }
}