import { Card } from "./Card";

export class Table {
    private _cards: Card[];

    constructor() {
        this._cards = [];
    }

    get cards() : Card[] {
        return this._cards;
    }

    add(cardToAdd: Card) {
        if(this._cards.findIndex(card => card.equals(cardToAdd)) >= 0) {
            throw new Error(`The card with the face ${cardToAdd.face} and suit ${cardToAdd.suit} is already on the table`);
        }
        this._cards.push(cardToAdd);
    }

    remove(cards: Card[]) : Card[] {
        if(!this.hasAllCards(cards)) {
            throw new Error(CARDS_NOT_ON_TABLE);
        }

        return cards.filter(toRemove => {
            const index = this._cards.findIndex(card => card.equals(toRemove));
            return this._cards.splice(index, 1)[0];
        });
    }

    removeAll(): Card[] {
        return this._cards.splice(0, this._cards.length);
    }

    flop(cards: Card[]) {
        cards.forEach(c => this._cards.push(c));
    }

    hasAllCards(cardsToTake: Card[]): boolean {
        return cardsToTake.every(toTake => this.cards.findIndex(t => t.face === toTake.face && t.suit === toTake.suit) >= 0);
    }

    get length(): number {
        return this._cards.length;
    }
}

export const CARDS_NOT_ON_TABLE = "Failed to remove cards. Some of the cards were not on the table";