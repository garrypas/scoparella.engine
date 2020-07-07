import { Player } from "../models/Player";
import { expect } from "chai";
import { Card } from "../models/Card";
import { Face } from "../models/Face";
import { Suit } from "../models/Suit";
import { Hand } from "../models/Hand";
import { CoinScores } from "./CoinScores";

describe("CoinScores tests", () => {
    it("addCoinsScores() awards a point to the hand with the most coins", () => {
        const hand1 = new Hand(new Player());
        const hand2 = new Hand(new Player());
        hand1.captured.push(new Card(Face.Ace, Suit.Coins));
        hand2.captured.push(new Card(Face.Ace, Suit.Clubs));
        const scores = new CoinScores().calculateScores([hand1, hand2]);
        const hand1Score = scores.find(score => score.player.equals(hand1.player));
        const hand2Score = scores.find(score => score.player.equals(hand2.player));
        expect(hand1Score?.score).to.equal(1);
        expect(hand2Score?.score).to.equal(0);
    });
});