import { Player } from '../models/Player';
import { Card } from '../models/Card';
import { Face } from '../models/Face';
import { Suit } from '../models/Suit';
import { Hand } from '../models/Hand';
import { SevenOfCoinsScore } from './SevenOfCoinsScore';

describe('SevenOfCoinsScore tests', () => {
  test('calculateScore() awards a point to the hand with the seven of coins', () => {
    const [hand1, hand2] = [new Hand(new Player()), new Hand(new Player())];
    hand1.capture(new Card(Face.Seven, Suit.Coins));
    hand2.capture(new Card(Face.Two, Suit.Coins));
    const scores = new SevenOfCoinsScore().calculateScores([hand1, hand2]);
    const hand1Score = scores.find((score) =>
      score.player.equals(hand1.player),
    );
    expect(hand1Score?.score).toEqual(1);
  });
});
