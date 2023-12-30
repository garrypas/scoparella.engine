import { Card } from '../models/Card';
import { Score } from '../models/Score';
import { Hand } from '../models/Hand';
import { Suit } from '../models/Suit';
import { CardScoringComparison } from './CardScoringComparison';
import { IScoreCalculator } from './IScoreCalculator';

export class CoinScores implements IScoreCalculator {
  calculateScores(hands: Hand[]): Score[] {
    return CardScoringComparison.compareCounts(
      hands,
      (cards) => cards.length,
      (card: Card) => card.suit === Suit.Coins,
    );
  }
}
