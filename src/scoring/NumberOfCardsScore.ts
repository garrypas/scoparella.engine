import { Score } from '../models/Score';
import { Hand } from '../models/Hand';
import { CardScoringComparison } from './CardScoringComparison';
import { IScoreCalculator } from './IScoreCalculator';

export class NumberOfCardsScore implements IScoreCalculator {
  calculateScores(hands: Hand[]): Score[] {
    return CardScoringComparison.compareCounts(hands, (cards) => cards.length);
  }
}
