import { Player } from "../models/Player";
import { expect } from "chai";
import { Card } from "../models/Card";
import { Face } from "../models/Face";
import { Suit } from "../models/Suit";
import { Hand } from "../models/Hand";
import { SevenOfCoinsScore } from "./SevenOfCoinsScore";

describe("SevenOfCoinsScore tests", () => {
    it("calculateScore() awards a point to the hand with the seven of coins", () => {
        const hand1 = new Hand(new Player());
        const hand2 = new Hand(new Player());
        hand1.captured.push(new Card(Face.Seven, Suit.Coins));
        hand2.captured.push(new Card(Face.Two, Suit.Coins));
        const scores = new SevenOfCoinsScore().calculateScores([ hand1, hand2 ]);
        const hand1Score = scores.find(score => score.player.equals(hand1.player));
        expect(hand1Score?.score).to.equal(1);
    });
});