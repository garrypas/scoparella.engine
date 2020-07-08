import { Suit } from "./Suit";
import { Face, getFaceValue } from "./Face";
import { getCombinations } from "../utils/getCombinations";
import { IComparable } from "../core/IComparable";

export class Card implements IComparable { 
    private _face: Face;
    private _suit: Suit;

    constructor(face: Face, suit: Suit) {
        this._face = face;
        this._suit = suit;
    }

    get face() {
        return this._face;
    }

    get suit() {
        return this._suit;
    }

    equals(other: Card): boolean {
        return this.faceEquals(other) && this.suitEquals(other);
    }

    suitEquals(other: Card): boolean {
        return this.suit === other.suit;
    }

    faceEquals(other: Card): boolean {
        return this.face === other.face;
    }

    getFaceSumMatches(cardsToFindSumMatches: Card[]) {
        return getCombinations(cardsToFindSumMatches).filter(cards => Card.sumFaces(cards)  === getFaceValue(this._face));
    }

    static sumFaces(cards: Card[]) {
        return cards.map(c => getFaceValue(c._face)).reduce((x, y) => x + y);
    }

    static fromObject(jsonObj: Card): Card {
        return new Card(jsonObj._face, jsonObj._suit);
    }

    static fromArray(arr: Card[]): Card[] {
        return arr.map(c => this.fromObject(c));
    }
}