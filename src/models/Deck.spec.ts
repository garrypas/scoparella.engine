import { Deck } from './Deck';
import { Face } from './Face';
import { Suit } from './Suit';
import { ComparableArray } from '../core/ComparableArray';

jest.mock('../utils/RandomNumberRangeGenerator', () => ({
  RandomNumberRangeGenerator: {
    generateRange: (scale: number) => {
      const result: number[] = [];
      for (let i = 0; i < scale; i++) {
        result.push(i);
      }
      return result;
    },
  },
}));

describe('Deck tests', function () {
  let _deck: Deck;

  beforeEach(() => {
    _deck = new Deck();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Has 40 cards on initialization', () => {
    expect(_deck.length).toEqual(40);
  });

  test('Takes cards', () => {
    const card1 = _deck.take()[0];
    expect(card1.face).toEqual(Face.King);
    expect(card1.suit).toEqual(Suit.Clubs);
    expect(_deck.length).toEqual(39);

    _deck.take(4);
    expect(_deck.length).toEqual(35);

    const card2 = _deck.take()[0];
    expect(card2.face).toEqual(Face.Knight);
    expect(card2.suit).toEqual(Suit.Cups);
    expect(_deck.length).toEqual(34);
  });

  describe('fromDto/toDto() serializes/deserializes the Deck instance', () => {
    let _deckAfter: Deck;
    beforeEach(() => {
      _deck.take(10);
      _deckAfter = Deck.fromDto(Deck.toDto(_deck));
    });

    test('cards serialized/deserialized', () => {
      expect(_deckAfter).toHaveLength(30);
      expect(
        ComparableArray.allMatch(_deck.cards, _deckAfter.cards),
      ).toBeTruthy();
    });
  });
});
