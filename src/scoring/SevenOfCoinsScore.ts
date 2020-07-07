import { Card } from "../models/Card";
import { Score } from "../models/Score";
import { Hand } from "../models/Hand";
import { Suit } from "../models/Suit";
import { Face } from "../models/Face";
import { IScoreCalculator } from "./IScoreCalculator";

export class SevenOfCoinsScore implements IScoreCalculator {
    calculateScores(hands: Hand[]): Score[] {
        return hands.map(hand => new Score(hand.player, hand.captured.find(c => c.equals(new Card(Face.Seven, Suit.Coins))) ? 1 : 0));
    }
}
