import { Player } from '../models/Player';
import { Card } from '../models/Card';
import { Score } from '../models/Score';
import { Hand } from '../models/Hand';
import { SevenOfCoinsScore } from './SevenOfCoinsScore';
import { CoinScores } from './CoinScores';
import { NumberOfCardsScore } from './NumberOfCardsScore';
import { IScoreCalculator } from './IScoreCalculator';
import { ScopaScore } from './ScopaScore';
import { ScoreboardDto } from '@scoparella/dtos';

function createScoreCalculators(): IScoreCalculator[] {
  return [new NumberOfCardsScore(), new CoinScores(), new SevenOfCoinsScore()];
}

export class Scoreboard {
  private _scores: Score[];
  private _scopas: Card[][];
  private _scoreCalculators: IScoreCalculator[];

  constructor(scoreCalculators: IScoreCalculator[] = createScoreCalculators()) {
    this._scores = [];
    this._scopas = [];
    this._scoreCalculators = scoreCalculators;
  }

  add(player: Player) {
    this._scores.push(new Score(player, 0));
    this._scopas.push([]);
  }

  addScopa(player: Player, card: Card) {
    this._scopas[this.playerIndex(player)].push(card);
  }

  private playerIndex(player: Player): number {
    return this._scores.findIndex((p) => p.player.equals(player));
  }

  get length(): number {
    return this._scores.length;
  }

  get players(): Player[] {
    return this._scores.map((s) => s.player);
  }

  score(player: Player): number {
    const thisScore: Score | undefined = this._scores.find((s) =>
      s.player.equals(player),
    );
    if (!thisScore) {
      throw new Error(
        'Error getting score. The player could not be found on the scoreboard',
      );
    }
    return thisScore.score;
  }

  clearScopas() {
    for (let i = 0; i < this._scopas.length; i++) {
      this._scopas[i] = [];
    }
  }

  getScopas(player: Player): Card[] {
    return this._scopas[this.playerIndex(player)].slice();
  }

  calculateScores(hands: Hand[]): Score[] {
    if (hands.length !== this._scores.length) {
      throw new Error(
        'Hands must have the same length as the number of players on the scoreboard',
      );
    }
    const thisRoundOfScores = mergeScores([
      mergeScores(
        this._scoreCalculators.map((calculator) =>
          calculator.calculateScores(hands),
        ),
      ),
      ScopaScore.scoreScopas(
        this._scores.map((s) => s.player),
        this._scopas,
      ),
    ]);
    this._scores = mergeScores([thisRoundOfScores, this._scores]);
    return thisRoundOfScores;
  }

  static fromDto(jsonObj: ScoreboardDto): Scoreboard {
    const scoreboard = new Scoreboard();
    scoreboard._scopas = jsonObj.scopas.map((scopaCards) =>
      scopaCards.map((c) => Card.fromDto(c)),
    );
    scoreboard._scores = jsonObj.scores.map((s) => Score.fromDto(s));
    return scoreboard;
  }

  static toDto(obj: Scoreboard): ScoreboardDto {
    return {
      scopas: obj._scopas,
      scores: Score.toDtoArray(obj._scores),
    };
  }
}

function mergeScores(scores: Score[][]): Score[] {
  if (scores.length < 1) {
    return [];
  }
  if (!scores.every((score) => score.length === scores[0].length)) {
    throw new Error(
      'Scores can only be merged if every element has an array of equal length',
    );
  }
  return scores[0].map(
    (_, i) =>
      new Score(
        scores[0][i].player,
        scores.map((s) => s[i].score).reduce((x, y) => x + y),
      ),
  );
}
