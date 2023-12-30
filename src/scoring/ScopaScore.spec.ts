import { ScopaScore } from "./ScopaScore";
import { Player } from "../models/Player";
import { Card } from "../models/Card";
import { Face } from "../models/Face";
import { Suit } from "../models/Suit";

describe("ScopaScore tests", () => {
    test("Counts scopas", () => {
        const score = ScopaScore.scoreScopas(
            [ new Player(), new Player() ],
            [
                [ new Card(Face.Ace, Suit.Clubs), new Card(Face.Two, Suit.Clubs) ],
                []
            ]
        );
        expect(score[0].score).toEqual(2);
        expect(score[1].score).toEqual(0);
    });
});