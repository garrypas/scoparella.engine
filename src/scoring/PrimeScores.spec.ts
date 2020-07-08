import { expect } from "chai";
import { Hand } from "../models/Hand";
import { Face } from "../models/Face";
import { Suit } from "../models/Suit";
import { Card } from "../models/Card";
import { Player } from "../models/Player";
import { PrimeScores, FACE_SCORES } from "./PrimeScores";

describe("PrimeScores tests", () => {
    describe("calculateScores()", () => {
        it("Calculates prime - tie when equal", () => {
            const [ hand1, hand2 ] = [ new Hand(new Player()), new Hand(new Player()) ];

            hand1.capture([
                new Card(Face.Seven, Suit.Clubs),
                new Card(Face.Seven, Suit.Coins),
                new Card(Face.Six, Suit.Swords),
                new Card(Face.Six, Suit.Cups)
            ]);
            hand2.capture([
                new Card(Face.Six, Suit.Clubs),
                new Card(Face.Six, Suit.Coins),
                new Card(Face.Seven, Suit.Swords),
                new Card(Face.Seven, Suit.Cups)
            ]);

            const scores = new PrimeScores().calculateScores([ hand1, hand2 ]);
            const hand1Score = scores.find(score => score.player.equals(hand1.player));
            const hand2Score = scores.find(score => score.player.equals(hand2.player));
            expect(hand1Score?.score).to.equal(0);
            expect(hand2Score?.score).to.equal(0);
        });

        it("Calculates prime - awards point to player with higher score", () => {
            const [ hand1, hand2 ] = [ new Hand(new Player()), new Hand(new Player()) ];

            hand1.capture([
                new Card(Face.Seven, Suit.Clubs),
                new Card(Face.Seven, Suit.Coins),
                new Card(Face.Six, Suit.Swords),
                new Card(Face.Six, Suit.Cups)
            ]);
            hand2.capture([
                new Card(Face.Six, Suit.Clubs),
                new Card(Face.Six, Suit.Coins),
                new Card(Face.Seven, Suit.Swords),
                new Card(Face.Five, Suit.Cups)
            ]);
            const scores = new PrimeScores().calculateScores([ hand1, hand2 ]);
            const hand1Score = scores.find(score => score.player.equals(hand1.player));
            const hand2Score = scores.find(score => score.player.equals(hand2.player));
            expect(hand1Score?.score).to.equal(1);
            expect(hand2Score?.score).to.equal(0);
        });
    });

    describe("calculatePrime", () =>  {
        [
            { face: Face.Seven, faceOneLower: Face.Six },
            { face: Face.Six, faceOneLower: Face.Ace },
            { face: Face.Ace, faceOneLower: Face.Five },
            { face: Face.Five, faceOneLower: Face.Four },
            { face: Face.Four, faceOneLower: Face.Three },
            { face: Face.Three, faceOneLower: Face.Two },
            { face: Face.Two, faceOneLower: Face.Knight },
            { face: Face.Knight, faceOneLower: Face.Knave },
            { face: Face.Knave, faceOneLower: Face.King },
            { face: Face.King, faceOneLower: null },
        ].forEach(testCase => {            
            it("Calculates prime - tie when equal", () => {
                const expectedScore = FACE_SCORES.find(f => f.face === testCase.face)?.score;
                const cards = [
                    new Card(testCase.face, Suit.Clubs),
                ];
                if(testCase.faceOneLower) {
                    cards.push(new Card(testCase.faceOneLower, Suit.Clubs))
                }
                const primeScore = new PrimeScores().calculatePrime(cards, Suit.Clubs);
                expect(primeScore).to.equal(expectedScore);
            });
        });

        it("Calculates prime - segregates by suit", () => {
            const cards = [
                new Card(Face.Seven, Suit.Coins),
                new Card(Face.Six, Suit.Clubs),
            ];
            const primeScore = new PrimeScores().calculatePrime(cards, Suit.Clubs);
            expect(primeScore).to.equal(18);
        });
    });
});