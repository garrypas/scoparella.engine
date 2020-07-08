import { Card } from "./Card";
import { Face } from "./Face";
import { Suit } from "./Suit";
import { RandomNumberRangeGenerator } from "../utils/RandomNumberRangeGenerator";
import { IDeckDto } from "../dtos/IDeckDto";

export class Deck {
    private _deck: Card[];
    constructor() {
        const cards: Card[] = [];
        Object.values(Face).forEach(face => {
            Object.values(Suit).forEach(suit => {
                cards.push(new Card(Face[face], Suit[suit]));
            });
        });
        this._deck = RandomNumberRangeGenerator.generateRange(40).map(n => cards[n]);
    }

    get cards(): Card[] {
        return this._deck;
    }

    take(numberToTake: number = 1): Card [] {
        const cards: Card[] = [];
        for(let i = 0; i < numberToTake; i++) {
            const card = this._deck.pop();
            if(!card) {
                throw new Error("Card is undefined.");
            }
            cards.push(card);
        }
        return cards;
    }

    get length(): number {
        return this._deck.length;
    }

    static fromDto(jsonObj: IDeckDto): Deck {
        const deck = new Deck();
        deck._deck = jsonObj.deck.map(cardJsonObj => Card.fromDto(cardJsonObj))
        return deck;
    }

    static toDto(obj: Deck): IDeckDto {
        return {
            deck: Card.toDtoArray(obj._deck)
        }
    }
}