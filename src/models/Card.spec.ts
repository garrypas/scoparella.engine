import { Card } from './Card';
import { Face } from './Face';
import { Suit } from './Suit';

describe('Card tests', function () {
  let card: Card;

  beforeEach(() => {
    card = new Card(Face.Seven, Suit.Clubs);
  });

  test('equals() is a match when card has same suit and face', () => {
    expect(card.equals(new Card(card.face, card.suit))).toBeTruthy();
  });

  test('equals() is not a match when card has different suit', () => {
    expect(card.equals(new Card(card.face, Suit.Coins))).not.toBeTruthy();
  });

  test('equals() is not a match when card has different face', () => {
    expect(card.equals(new Card(Face.Two, card.suit))).not.toBeTruthy();
  });

  test('suitEquals() is a match when card has same suit', () => {
    expect(card.suitEquals(new Card(card.face, card.suit))).toBeTruthy();
  });

  test('suitEquals() is not a match when card has different suit', () => {
    expect(card.suitEquals(new Card(card.face, Suit.Coins))).not.toBeTruthy();
  });

  test('faceEquals() is a match when card has same face', () => {
    expect(card.faceEquals(new Card(card.face, card.suit))).toBeTruthy();
  });

  test('faceEquals() is not a match when card has different face', () => {
    expect(card.faceEquals(new Card(Face.Two, card.suit))).not.toBeTruthy();
  });

  test('getFaceSumMatches() finds matches when present', () => {
    const matches = card.getFaceSumMatches([
      new Card(Face.Two, Suit.Clubs),
      new Card(Face.Ace, Suit.Swords),
      new Card(Face.Two, Suit.Swords),
      new Card(Face.Three, Suit.Swords),
    ]);
    expect(matches).toHaveLength(1);
    expect(Card.sumFaces(matches[0])).toEqual(7);
  });

  test('sumFaces() sums', () => {
    const sum = Card.sumFaces([
      new Card(Face.Two, Suit.Clubs),
      new Card(Face.Ace, Suit.Swords),
    ]);
    expect(sum).toEqual(3);
  });

  describe('fromDto()', () => {
    test('Copies the Card instance into a DTO', () => {
      const cardAfter = Card.fromDto({ face: card.face, suit: card.suit });
      expect(cardAfter.face).toEqual(card.face);
      expect(cardAfter.suit).toEqual(card.suit);
    });
  });

  describe('fromDtoArray()', () => {
    test('Copies the array of Card instances into the DTO', () => {
      const cardOther = new Card(Face.Four, Suit.Coins);
      const cards = Card.fromDtoArray([card, cardOther]);
      expect(cards[0].face).toEqual(card.face);
      expect(cards[0].suit).toEqual(card.suit);
      expect(cards[1].face).toEqual(cardOther.face);
      expect(cards[1].suit).toEqual(cardOther.suit);
    });
  });

  test('fromDto/toDto() serializes/deserializes() the Card instance', () => {
    const cardAfter = Card.toDto(new Card(card.face, card.suit));
    expect(cardAfter.face).toEqual(card.face);
    expect(cardAfter.suit).toEqual(card.suit);
  });

  test('fromDtoArray/toDtoArray() serializes/deserializes() the Card array', () => {
    const cardOther = new Card(Face.Four, Suit.Coins);
    const cards = Card.toDtoArray([card, cardOther]);
    expect(cards[0].face).toEqual(card.face);
    expect(cards[0].suit).toEqual(card.suit);
    expect(cards[1].face).toEqual(cardOther.face);
    expect(cards[1].suit).toEqual(cardOther.suit);
  });
});
