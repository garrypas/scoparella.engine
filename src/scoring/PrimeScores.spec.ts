import { Hand } from '../models/Hand';
import { Face } from '../models/Face';
import { Suit } from '../models/Suit';
import { Card } from '../models/Card';
import { Player } from '../models/Player';
import { PrimeScores, FACE_SCORES } from './PrimeScores';

describe('PrimeScores tests', () => {
  describe('calculateScores()', () => {
    test('only awards primiera to hands with cards in every suit', () => {
      const eligibleHand = new Hand(new Player());
      const ineligibleHand = new Hand(new Player());
      eligibleHand.capture([
        new Card(Face.Four, Suit.Coins),
        new Card(Face.Four, Suit.Cups),
        new Card(Face.Four, Suit.Swords),
        new Card(Face.Four, Suit.Clubs),
      ]);
      ineligibleHand.capture([
        new Card(Face.Seven, Suit.Coins),
        new Card(Face.Seven, Suit.Cups),
        new Card(Face.Seven, Suit.Swords),
      ]);

      const scores = new PrimeScores().calculateScores([
        eligibleHand,
        ineligibleHand,
      ]);

      expect(
        scores.find((score) => score.player.equals(eligibleHand.player))?.score,
      ).toEqual(1);
      expect(
        scores.find((score) => score.player.equals(ineligibleHand.player))
          ?.score,
      ).toEqual(0);
    });

    test('does not award a point when multiple eligible hands tie for most', () => {
      const hands = [
        new Hand(new Player()),
        new Hand(new Player()),
        new Hand(new Player()),
      ];
      const highestPrime = [
        new Card(Face.Seven, Suit.Coins),
        new Card(Face.Seven, Suit.Cups),
        new Card(Face.Seven, Suit.Swords),
        new Card(Face.Seven, Suit.Clubs),
      ];
      hands[0].capture(highestPrime);
      hands[1].capture(highestPrime);
      hands[2].capture([
        new Card(Face.Six, Suit.Coins),
        new Card(Face.Six, Suit.Cups),
        new Card(Face.Six, Suit.Swords),
        new Card(Face.Six, Suit.Clubs),
      ]);

      const scores = new PrimeScores().calculateScores(hands);

      expect(scores.map((score) => score.score)).toEqual([0, 0, 0]);
    });

    test('Calculates prime - tie when equal', () => {
      const [hand1, hand2] = [new Hand(new Player()), new Hand(new Player())];

      hand1.capture([
        new Card(Face.Seven, Suit.Clubs),
        new Card(Face.Seven, Suit.Coins),
        new Card(Face.Six, Suit.Swords),
        new Card(Face.Six, Suit.Cups),
      ]);
      hand2.capture([
        new Card(Face.Six, Suit.Clubs),
        new Card(Face.Six, Suit.Coins),
        new Card(Face.Seven, Suit.Swords),
        new Card(Face.Seven, Suit.Cups),
      ]);

      const scores = new PrimeScores().calculateScores([hand1, hand2]);
      const hand1Score = scores.find((score) =>
        score.player.equals(hand1.player),
      );
      const hand2Score = scores.find((score) =>
        score.player.equals(hand2.player),
      );
      expect(hand1Score?.score).toEqual(0);
      expect(hand2Score?.score).toEqual(0);
    });

    test('Calculates prime - awards point to player with higher score', () => {
      const [hand1, hand2] = [new Hand(new Player()), new Hand(new Player())];

      hand1.capture([
        new Card(Face.Seven, Suit.Clubs),
        new Card(Face.Seven, Suit.Coins),
        new Card(Face.Six, Suit.Swords),
        new Card(Face.Six, Suit.Cups),
      ]);
      hand2.capture([
        new Card(Face.Six, Suit.Clubs),
        new Card(Face.Six, Suit.Coins),
        new Card(Face.Seven, Suit.Swords),
        new Card(Face.Five, Suit.Cups),
      ]);
      const scores = new PrimeScores().calculateScores([hand1, hand2]);
      const hand1Score = scores.find((score) =>
        score.player.equals(hand1.player),
      );
      const hand2Score = scores.find((score) =>
        score.player.equals(hand2.player),
      );
      expect(hand1Score?.score).toEqual(1);
      expect(hand2Score?.score).toEqual(0);
    });
  });

  describe('calculatePrime', () => {
    [
      { face: Face.Seven, faceOneLower: Face.Six },
      { face: Face.Six, faceOneLower: Face.Ace },
      { face: Face.Ace, faceOneLower: Face.Five },
      { face: Face.Five, faceOneLower: Face.Four },
      { face: Face.Four, faceOneLower: Face.Three },
      { face: Face.Three, faceOneLower: Face.Two },
      { face: Face.Two, faceOneLower: Face.Knight },
      { face: Face.Knight, faceOneLower: Face.Knave },
      { face: Face.Knave, faceOneLower: Face.King },
      { face: Face.King, faceOneLower: null },
    ].forEach((testCase) => {
      test('Calculates prime - tie when equal', () => {
        const expectedScore = FACE_SCORES.find(
          (f) => f.face === testCase.face,
        )?.score;
        const cards = [new Card(testCase.face, Suit.Clubs)];
        if (testCase.faceOneLower) {
          cards.push(new Card(testCase.faceOneLower, Suit.Clubs));
        }
        const primeScore = new PrimeScores().calculatePrime(cards, Suit.Clubs);
        expect(primeScore).toEqual(expectedScore);
      });
    });

    test('Calculates prime - segregates by suit', () => {
      const cards = [
        new Card(Face.Seven, Suit.Coins),
        new Card(Face.Six, Suit.Clubs),
      ];
      const primeScore = new PrimeScores().calculatePrime(cards, Suit.Clubs);
      expect(primeScore).toEqual(18);
    });
  });
});
