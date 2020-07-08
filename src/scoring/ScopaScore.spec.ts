import { ScopaScore } from "./ScopaScore";
import { Player } from "../models/Player";
import { Card } from "../models/Card";
import { Face } from "../models/Face";
import { Suit } from "../models/Suit";
import { expect } from "chai";

describe("ScopaScore tests", () => {
    it("Counts scopas", () => {
        const score = ScopaScore.scoreScopas(
            [ new Player(), new Player() ],
            [
                [ new Card(Face.Ace, Suit.Clubs), new Card(Face.Two, Suit.Clubs) ],
                []
            ]
        );
        expect(score[0].score).to.equal(2);
        expect(score[1].score).to.equal(0);
    });
});