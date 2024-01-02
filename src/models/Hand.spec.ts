import { Hand } from './Hand';
import { Player } from './Player';
import { Card } from './Card';
import { Face } from './Face';
import { Suit } from './Suit';
import { ComparableArray } from '../core/ComparableArray';

let ids: string[];
let player1: Player;
let player1Copy: Player;
let player2: Player;

beforeEach(() => {
  ids = ['p2', 'p1', 'p1'];
  [player1, player1Copy, player2] = [new Player(), new Player(), new Player()];
});

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('../utils/IdGenerator', () => ({
  IdGenerator: {
    generateId: () => ids.pop() || 'oops',
  },
}));

describe('Hand tests', function () {
  describe('equals()', () => {
    beforeEach(() => {});

    test('is true when players match', () => {
      const [hand1, hand2] = [new Hand(player1), new Hand(player1Copy)];
      expect(hand1.equals(hand2)).toBeTruthy();
    });

    test('is false when players do not match', () => {
      const [hand1, hand2] = [new Hand(player1), new Hand(player2)];
      expect(hand1.equals(hand2)).toBeFalsy();
    });
  });

  describe('hasCard()', () => {
    test('true when hand contains card', () => {
      const hand = new Hand(player1);
      hand.add(new Card(Face.Ace, Suit.Clubs));
      expect(hand.hasCard(new Card(Face.Ace, Suit.Clubs))).toBeTruthy();
    });

    test('false when hand does not contain card', () => {
      const hand = new Hand(player1);
      hand.add(new Card(Face.Ace, Suit.Clubs));
      expect(hand.hasCard(new Card(Face.Three, Suit.Clubs))).not.toBeTruthy();
    });
  });

  describe('remove()', () => {
    test("removes the card from the player's hand", () => {
      const hand = new Hand(player1);
      hand.add(new Card(Face.Ace, Suit.Clubs));
      hand.remove(new Card(Face.Ace, Suit.Clubs));
      expect(hand.cards).toHaveLength(0);
    });

    test('Returns the removed card', () => {
      const [card1, card2] = [
        new Card(Face.Ace, Suit.Clubs),
        new Card(Face.Two, Suit.Clubs),
      ];
      const hand = new Hand(player1);
      hand.add([card1, card2]);
      const removed = hand.remove(card1);
      expect(removed.equals(card1)).toBeTruthy();
    });

    test("Throws error if the card isn't in the player's hand", () => {
      const hand = new Hand(player1);
      expect(() => hand.remove(new Card(Face.Ace, Suit.Clubs))).toThrow();
    });
  });

  describe('fromDto/toDto() serializes/deserializes the Hand instance', () => {
    let _handAfter: Hand;
    let _card1: Card, _card2: Card, card3: Card;
    beforeEach(() => {
      [_card1, _card2, card3] = [
        new Card(Face.Ace, Suit.Clubs),
        new Card(Face.Two, Suit.Clubs),
        new Card(Face.Five, Suit.Clubs),
      ];
      const hand = new Hand(player1);
      hand.add([_card1, _card2]);
      hand.capture(card3);
      _handAfter = Hand.fromDto(Hand.toDto(hand));
    });

    test('cards serialized/deserialized', () => {
      expect(_handAfter.cards).toHaveLength(2);
      expect(_handAfter.hasCard(_card1)).toBeTruthy();
      expect(_handAfter.hasCard(_card2)).toBeTruthy();
    });

    test('captured serialized/deserialized', () => {
      expect(_handAfter.captured).toHaveLength(1);
      expect(ComparableArray.hasItem(card3, _handAfter.captured)).toBeTruthy();
    });

    test('player serialized/deserialized', () => {
      expect(_handAfter.player.equals(player1)).toBeTruthy();
    });
  });

  describe('fromDtoArray/toDtoArray() serializes/deserializes the Hand array', () => {
    let _handsAfter: Hand[];
    let _card1: Card, _card2: Card, _card3: Card;
    let _card4: Card, _card5: Card, _card6: Card;

    beforeEach(() => {
      [_card1, _card2, _card3] = [
        new Card(Face.Ace, Suit.Clubs),
        new Card(Face.Two, Suit.Clubs),
        new Card(Face.Five, Suit.Clubs),
      ];

      const hand = new Hand(player1);
      hand.add([_card1, _card2]);
      hand.capture(_card3);

      player2 = new Player();
      [_card4, _card5, _card6] = [
        new Card(Face.Ace, Suit.Coins),
        new Card(Face.Two, Suit.Coins),
        new Card(Face.Five, Suit.Coins),
      ];
      const hand2 = new Hand(player2);
      hand2.add([_card4]);
      hand2.capture([_card5, _card6]);

      _handsAfter = Hand.fromDtoArray(Hand.toDtoArray([hand, hand2]));
    });

    test('cards serialized/deserialized', () => {
      expect(_handsAfter[0].cards).toHaveLength(2);
      expect(
        ComparableArray.isSubset([_card1, _card2], _handsAfter[0].cards),
      ).toBeTruthy();

      expect(_handsAfter[1].cards).toHaveLength(1);
      expect(_handsAfter[1].hasCard(_card4)).toBeTruthy();
    });

    test('captured serialized/deserialized', () => {
      expect(_handsAfter[0].captured).toHaveLength(1);
      expect(
        ComparableArray.hasItem(_card3, _handsAfter[0].captured),
      ).toBeTruthy();

      expect(_handsAfter[1].captured).toHaveLength(2);
      expect(
        ComparableArray.isSubset([_card5, _card6], _handsAfter[1].captured),
      ).toBeTruthy();
    });

    test('player serialized/deserialized', () => {
      expect(_handsAfter[0].player.equals(player1)).toBeTruthy();
      expect(_handsAfter[1].player.equals(player2)).toBeTruthy();
    });
  });

  describe('capture()', () => {
    test('captures single', () => {
      const hand = new Hand(player1);
      hand.capture(new Card(Face.Ace, Suit.Clubs));
      expect(hand.captured).toHaveLength(1);
    });

    test('captures many', () => {
      const hand = new Hand(player1);
      hand.capture([
        new Card(Face.Ace, Suit.Clubs),
        new Card(Face.Ace, Suit.Coins),
      ]);
      expect(hand.captured).toHaveLength(2);
    });
  });
});
