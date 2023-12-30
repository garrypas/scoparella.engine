import { Player } from '../models/Player';
import { Card } from '../models/Card';
import { Face } from '../models/Face';
import { Suit } from '../models/Suit';
import { Hand } from '../models/Hand';
import { NumberOfCardsScore } from './NumberOfCardsScore';

describe('NumberOfCardsScore tests', () => {
  test('addNumberOfCardsScore() awards a point to the hand with the most captured cards', () => {
    const [hand1, hand2] = [new Hand(new Player()), new Hand(new Player())];
    hand1.capture(new Card(Face.Seven, Suit.Clubs));
    const scores = new NumberOfCardsScore().calculateScores([hand1, hand2]);
    const hand1Score = scores.find((score) =>
      score.player.equals(hand1.player),
    );
    const hand2Score = scores.find((score) =>
      score.player.equals(hand2.player),
    );
    expect(hand1Score?.score).toEqual(1);
    expect(hand2Score?.score).toEqual(0);
  });

  test('addNumberOfCardsScore() awards no point if both players captured the same number of cards', () => {
    const [hand1, hand2] = [new Hand(new Player()), new Hand(new Player())];
    hand1.capture(new Card(Face.Seven, Suit.Clubs));
    hand2.capture(new Card(Face.Seven, Suit.Cups));
    const scores = new NumberOfCardsScore().calculateScores([hand1, hand2]);
    const hand1Score = scores.find((score) =>
      score.player.equals(hand1.player),
    );
    const hand2Score = scores.find((score) =>
      score.player.equals(hand2.player),
    );
    expect(hand1Score?.score).toEqual(0);
    expect(hand2Score?.score).toEqual(0);
  });
});
