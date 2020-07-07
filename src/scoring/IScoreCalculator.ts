import { Score } from "../models/Score";
import { Hand } from "../models/Hand";

export interface IScoreCalculator {
    calculateScores(hands: Hand[]): Score[];
}
