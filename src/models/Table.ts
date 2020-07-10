import { Card } from "./Card";
import { ComparableArray } from "../core/ComparableArray";
import { TableDto } from "@scoparella/dtos";

export class Table {
    private _cards: Card[];

    constructor() {
        this._cards = [];
    }

    get cards() : Card[] {
        return this._cards.slice();
    }

    add(cardToAdd: Card) {
        if(this._cards.findIndex(card => card.equals(cardToAdd)) >= 0) {
            throw new Error(`The card with the face ${cardToAdd.face} and suit ${cardToAdd.suit} is already on the table`);
        }
        this._cards.push(cardToAdd);
    }

    remove(card: Card | Card[]) : Card[] {
        if(!Array.isArray(card)) {
            card = [card];
        }
        if(!ComparableArray.isSubset(card, this._cards)) {
            throw new Error(CARDS_NOT_ON_TABLE);
        }
        return card.filter(toRemove => {
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

    get length(): number {
        return this._cards.length;
    }

    static fromDto(jsonObj: TableDto): Table {
        const table = new Table();
        table._cards = Card.fromDtoArray(jsonObj.cards);
        return table;
    }

    static toDto(obj: Table): TableDto {
        return { 
            cards: Card.toDtoArray(obj.cards)
        };
    }
}

export const CARDS_NOT_ON_TABLE = "Failed to remove cards. Some of the cards were not on the table";