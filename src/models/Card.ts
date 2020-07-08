import { Suit } from "./Suit";
import { Face, getFaceValue } from "./Face";
import { getCombinations } from "../utils/getCombinations";
import { IComparable } from "../core/IComparable";
import { ICardDto } from "../dtos/ICardDto";

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

    static fromDto(jsonObj: ICardDto): Card {
        return new Card(jsonObj.face as Face, jsonObj.suit as Suit);
    }

    static toDto(obj: Card): ICardDto {
        return { face: obj._face, suit: obj.suit };
    }

    static fromDtoArray(arr: ICardDto[]): Card[] {
        return arr.map(this.fromDto);
    }

    static toDtoArray(arr: Card[]): ICardDto[] {
        return arr.map(this.toDto);
    }
}