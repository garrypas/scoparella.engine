import { Card } from "./Card";
import { Player } from "./Player";

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
        return this._cards;
    }

    get player(): Player {
        return this._player;
    }

    get captured(): Card[] {
        return this._captured;
    }

    equals(other: Hand): boolean {
        return this.player.id === other.player.id;
    }

    hasCard(cardToCheck: Card): boolean {
        return !!this.cards.find(handCard => handCard.equals(cardToCheck));
    }

    remove(card: Card): Card {
        const cardToPlayIndex = this._cards.findIndex(t => t.equals(card));
        if(cardToPlayIndex < 0) {
            throw new Error(`Could not play ${card.face} of ${card.suit}. It is not in this player's hand.`);
        }
        return this._cards.splice(cardToPlayIndex, 1)[0];
    }
}