import { Card } from "./Card";
import { Player } from "./Player";
import { ComparableArray } from "../core/ComparableArray";
import { HandDto } from "@scoparella/dtos";
import { CardNotInPlayersHandError } from "../exceptions";

export class Hand {
    private _cards: Card[];
    private _player: Player;
    private _captured: Card[];
    
    constructor(player: Player) {
        this._cards = [];
        this._player = player;
        this._captured = [];
    }

    get cards(): Card[] {
        return this._cards.slice();
    }

    get player(): Player {
        return this._player;
    }

    get captured(): Card[] {
        return this._captured.slice();
    }

    add(card: Card | Card[]) {
        if(!Array.isArray(card)) {
            card = [card];
        }
        this._cards.push(...card);
    }

    capture(card: Card | Card[]) {
        if(!Array.isArray(card)) {
            card = [card];
        }
        this._captured.push(...card);
    }

    equals(other: Hand): boolean {
        return this.player.id === other.player.id;
    }

    hasCard(cardToCheck: Card): boolean {
        return ComparableArray.hasItem(cardToCheck, this._cards);
    }

    remove(card: Card): Card {
        const cardToPlayIndex = this._cards.findIndex(t => t.equals(card));
        if(cardToPlayIndex < 0) {
            throw new CardNotInPlayersHandError(card.face, card.suit);
        }
        return this._cards.splice(cardToPlayIndex, 1)[0];
    }

    static fromDto(jsonObj: HandDto): Hand {
        const hand = new Hand(Player.fromDto(jsonObj.player));
        hand._captured = Card.fromDtoArray(jsonObj.captured);
        hand._cards = Card.fromDtoArray(jsonObj.cards);
        return hand;
    }

    static fromDtoArray(hands: HandDto[]): Hand[] {
        return hands.map(this.fromDto);
    }

    static toDto(obj: Hand): HandDto {
        return {
            captured: Card.toDtoArray(obj._captured),
            cards: Card.toDtoArray(obj._cards),
            player: Player.toDto(obj._player)
        };
    }

    static toDtoArray(arr: Hand[]): HandDto[] {
        return arr.map(this.toDto);
    }
}