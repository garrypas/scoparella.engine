import { Card } from "./Card";
import { Player } from "./Player";
import { ComparableArray } from "../core/ComparableArray";

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
            throw new Error(`Could not play ${card.face} of ${card.suit}. It is not in this player's hand.`);
        }
        return this._cards.splice(cardToPlayIndex, 1)[0];
    }

    static fromObject(jsonObj: Hand): Hand {
        const hand = new Hand(Player.fromObject(jsonObj._player));
        hand._captured = Card.fromArray(jsonObj._captured);
        hand._cards = Card.fromArray(jsonObj._cards);
        return hand;
    }

    static fromArray(hands: Hand[]): Hand[] {
        return hands.map(hand => this.fromObject(hand));
    }
}