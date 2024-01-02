import { Suit } from './Suit';
import { Face, getFaceValue } from './Face';
import { getCombinations } from '../utils/getCombinations';
import { Comparable } from '../core/Comparable';
import { CardDto } from '@scoparella/dtos';

export class Card implements Comparable<Card> {
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
    return getCombinations(cardsToFindSumMatches).filter(
      (cards) => Card.sumFaces(cards) === getFaceValue(this._face),
    );
  }

  static sumFaces(cards: Card[]) {
    return cards
      .map((card) => getFaceValue(card._face))
      .reduce((x, y) => x + y);
  }

  static fromDto(jsonObj: CardDto): Card {
    return new Card(jsonObj.face as Face, jsonObj.suit as Suit);
  }

  static toDto(obj: Card): CardDto {
    return { face: obj._face, suit: obj.suit };
  }

  static fromDtoArray(arr: CardDto[]): Card[] {
    return arr.map(this.fromDto);
  }

  static toDtoArray(arr: Card[]): CardDto[] {
    return arr.map(this.toDto);
  }
}
