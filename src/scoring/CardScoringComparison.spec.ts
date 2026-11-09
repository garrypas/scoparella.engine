import { Card } from '../models/Card';
import { Face } from '../models/Face';
import { Hand } from '../models/Hand';
import { Player } from '../models/Player';
import { Suit } from '../models/Suit';
import { CardScoringComparison } from './CardScoringComparison';

describe('CardScoringComparison tests', () => {
  test('does not award a point when multiple hands tie for the highest count', () => {
    const hands = [
      new Hand(new Player()),
      new Hand(new Player()),
      new Hand(new Player()),
    ];
    hands[0].capture([
      new Card(Face.Ace, Suit.Coins),
      new Card(Face.Two, Suit.Coins),
    ]);
    hands[1].capture([
      new Card(Face.Three, Suit.Coins),
      new Card(Face.Four, Suit.Coins),
    ]);
    hands[2].capture([new Card(Face.Five, Suit.Coins)]);

    const scores = CardScoringComparison.compareCounts(
      hands,
      (cards) => cards.length,
    );

    expect(scores.map((score) => score.score)).toEqual([0, 0, 0]);
  });

  test('awards a point to the unique hand with the highest count', () => {
    const hands = [new Hand(new Player()), new Hand(new Player())];
    hands[0].capture([
      new Card(Face.Ace, Suit.Coins),
      new Card(Face.Two, Suit.Coins),
    ]);
    hands[1].capture([new Card(Face.Three, Suit.Coins)]);

    const scores = CardScoringComparison.compareCounts(
      hands,
      (cards) => cards.length,
    );

    expect(scores.map((score) => score.score)).toEqual([1, 0]);
  });
});
