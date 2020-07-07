import { Score } from "../models/Score";
import { Hand } from "../models/Hand";
import { Card } from "../models/Card";

export type CardScoringComparisonFilter = (card: Card) => boolean;
export type ScoreFunction = (cards: Card[]) => number;

export class CardScoringComparison {
    static compareCounts(hands: Hand[], scoreFunction: ScoreFunction, filter: CardScoringComparisonFilter = () => true): Score[] {
        const scores = hands.map(hand => new Score(hand.player, 0));
        this.getMost(hands, scoreFunction, filter).forEach(hand => {
            const thisScore = scores.find(score => score.player.equals(hand.player));
            if (!thisScore)
                return;
            thisScore.score++;
        });
        return scores;
    }


    private static getMost(hands: Hand[], scoreFunction: ScoreFunction, filter: CardScoringComparisonFilter): Hand[] {
        const handReduced = hands.map(hand => ({ hand, itemsOfInterest: hand.captured.filter(filter) }));
        let highestValue = 0;
        handReduced.forEach(item => {
            const cardCount = scoreFunction(item.itemsOfInterest);
            if (cardCount > highestValue) {
                highestValue = cardCount;
            }
        });
        const handsWithMost = handReduced.filter(item => scoreFunction(item.itemsOfInterest) === highestValue);
        const isTie = handsWithMost.length === hands.length;
        if (!isTie) {
            return handsWithMost.map(item => item.hand);
        }
        return [];
    }
}
