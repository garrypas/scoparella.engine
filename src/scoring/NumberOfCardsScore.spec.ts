import { Player } from "../models/Player";
import { expect } from "chai";
import { Card } from "../models/Card";
import { Face } from "../models/Face";
import { Suit } from "../models/Suit";
import { Hand } from "../models/Hand";
import { NumberOfCardsScore } from "./NumberOfCardsScore";

describe("NumberOfCardsScore tests", () => {
    it("addNumberOfCardsScore() awards a point to the hand with the most captured cards", () => {
        const hand1 = new Hand(new Player());
        const hand2 = new Hand(new Player());
        hand1.captured.push(new Card(Face.Seven, Suit.Clubs));
        const scores = new NumberOfCardsScore().calculateScores([ hand1, hand2 ]);
        const hand1Score = scores.find(score => score.player.equals(hand1.player));
        const hand2Score = scores.find(score => score.player.equals(hand2.player));
        expect(hand1Score?.score).to.equal(1);
        expect(hand2Score?.score).to.equal(0);
    });

    it("addNumberOfCardsScore() awards no point if both players captured the same number of cards", () => {
        const hand1 = new Hand(new Player());
        const hand2 = new Hand(new Player());
        hand1.captured.push(new Card(Face.Seven, Suit.Clubs));
        hand2.captured.push(new Card(Face.Seven, Suit.Cups));
        const scores = new NumberOfCardsScore().calculateScores([ hand1, hand2 ]);
        const hand1Score = scores.find(score => score.player.equals(hand1.player));
        const hand2Score = scores.find(score => score.player.equals(hand2.player));
        expect(hand1Score?.score).to.equal(0);
        expect(hand2Score?.score).to.equal(0);
    });
});