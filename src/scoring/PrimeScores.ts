import { IScoreCalculator } from "./IScoreCalculator";
import { Hand } from "../models/Hand";
import { Score } from "../models/Score";
import { Suit } from "../models/Suit";
import { Card } from "../models/Card";
import { Face } from "../models/Face";
import { CardScoringComparison } from "./CardScoringComparison";

export const FACE_SCORES = [
    { face: Face.Seven,     score: 21 },
    { face: Face.Six,       score: 18 },
    { face: Face.Ace,       score: 16 },
    { face: Face.Five,      score: 15 },
    { face: Face.Four,      score: 14 },
    { face: Face.Three,     score: 13 },
    { face: Face.Two,       score: 12 },
    { face: Face.Knave,     score: 10 },
    { face: Face.Knight,    score: 10 },
    { face: Face.King,      score: 10 },
]

export class PrimeScores implements IScoreCalculator {
    calculateScores(hands: Hand[]): Score[] {
        return CardScoringComparison.compareCounts(hands, captured => {
            const coinsPrime = this.calculatePrime(captured, Suit.Coins);
            const cupsPrime = this.calculatePrime(captured, Suit.Cups);
            const swordsPrime = this.calculatePrime(captured, Suit.Swords);
            const clubsPrime = this.calculatePrime(captured, Suit.Clubs);
            return coinsPrime + cupsPrime + swordsPrime + clubsPrime;
        })
    }

    calculatePrime(cards: Card[], suit: Suit): number {
        const cardsOfThisSuit = cards.filter(card => card.suit === suit);
        return FACE_SCORES.find(faceScore => cardsOfThisSuit.find(card => card.face === faceScore.face))?.score || 0;
    }
}