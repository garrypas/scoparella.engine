import { Scoreboard } from './Scoreboard';
import { Player } from '../models/Player';
import { Card } from '../models/Card';
import { Face } from '../models/Face';
import { Suit } from '../models/Suit';
import { Hand } from '../models/Hand';
import { IScoreCalculator } from './IScoreCalculator';
import { ScopaScore } from './ScopaScore';
import { Score } from '../models/Score';

describe('Scoreboard tests', () => {
  let scoreboard: Scoreboard;
  let scoresToReturn: number[];
  let scopaScoreSpy: jest.SpyInstance;
  let scoreCalculator: IScoreCalculator;

  beforeEach(() => {
    scoresToReturn = [0, 1];
    scoreCalculator = {
      calculateScores: jest.fn((hands: Hand[]): Score[] => {
        return hands.map(
          (hand, idx) => new Score(hand.player, scoresToReturn[idx]),
        );
      }),
    } as IScoreCalculator;
    scopaScoreSpy = jest.spyOn(ScopaScore, 'scoreScopas');
    scoreboard = new Scoreboard([scoreCalculator]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('add() adds player', () => {
    scoreboard.add(new Player());
    scoreboard.add(new Player());
    expect(scoreboard.length).toEqual(2);
  });

  test('addScopa() increments scopa count', () => {
    const player = new Player();
    const card = new Card(Face.Ace, Suit.Coins);
    scoreboard.add(player);
    scoreboard.addScopa(player, card);
    const scopas = scoreboard.getScopas(player);
    expect(scopas).toHaveLength(1);
  });

  test('addScopa() adds a point to the score', () => {
    const [hand1, hand2] = [new Hand(new Player()), new Hand(new Player())];
    scoreboard.add(hand1.player);
    scoreboard.add(hand2.player);
    scoreboard.addScopa(hand2.player, new Card(Face.Ace, Suit.Clubs));
    const scores = scoreboard.calculateScores([hand1, hand2]);
    expect(scores[0].score).toEqual(0);
    expect(scores[1].score).toEqual(2);
  });

  test('clearScopas() clears scopas', () => {
    const player = new Player();
    const card = new Card(Face.Ace, Suit.Coins);
    scoreboard.add(player);
    scoreboard.addScopa(player, card);
    scoreboard.clearScopas();
    expect(scoreboard.getScopas(player)).toHaveLength(0);
  });

  test('calculateScore() calls score calculators', () => {
    const [hand1, hand2] = [new Hand(new Player()), new Hand(new Player())];
    scoreboard.add(hand1.player);
    scoreboard.add(hand2.player);
    scoreboard.calculateScores([hand1, hand2]);
    expect(scoreCalculator.calculateScores).toHaveBeenCalledTimes(1);
  });

  test('calculateScore() scores scopas', () => {
    const [hand1, hand2] = [new Hand(new Player()), new Hand(new Player())];
    scoreboard.add(hand1.player);
    scoreboard.add(hand2.player);
    scoreboard.calculateScores([hand1, hand2]);
    expect(scopaScoreSpy).toHaveBeenCalledTimes(1);
  });

  test('calculateScore() return scores only for this round', () => {
    const [hand1, hand2] = [new Hand(new Player()), new Hand(new Player())];
    scoreboard.add(hand1.player);
    scoreboard.add(hand2.player);
    scoreboard.calculateScores([hand1, hand2]);
    const scoresForThisRound = scoreboard.calculateScores([hand1, hand2]);
    expect(
      scoresForThisRound.find((score) => score.player.equals(hand1.player))
        ?.score,
    ).toEqual(0);
    expect(
      scoresForThisRound.find((score) => score.player.equals(hand2.player))
        ?.score,
    ).toEqual(1);
  });

  test('score() returns scores', () => {
    const [hand1, hand2] = [new Hand(new Player()), new Hand(new Player())];
    scoreboard.add(hand1.player);
    scoreboard.add(hand2.player);
    scoreboard.calculateScores([hand1, hand2]);
    expect(scoreboard.score(hand1.player)).toEqual(0);
    expect(scoreboard.score(hand2.player)).toEqual(1);
  });

  test('score() returns scores when multiple calculations have been performed', () => {
    const [hand1, hand2] = [new Hand(new Player()), new Hand(new Player())];
    scoreboard.add(hand1.player);
    scoreboard.add(hand2.player);
    scoreboard.calculateScores([hand1, hand2]);
    scoreboard.calculateScores([hand1, hand2]);
    expect(scoreboard.score(hand1.player)).toEqual(0);
    expect(scoreboard.score(hand2.player)).toEqual(2);
  });
});
