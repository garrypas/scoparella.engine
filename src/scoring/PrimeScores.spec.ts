import { expect } from "chai";
import { Hand } from "../models/Hand";
import { Face } from "../models/Face";
import { Suit } from "../models/Suit";
import { Card } from "../models/Card";
import { Player } from "../models/Player";
import { PrimeScores } from "./PrimeScores";

describe("PrimeScores tests", () => {
    describe("calculateScores()", () => {
        it("Calculates prime - tie when equal", () => {
            const hand1 = new Hand(new Player());
            const hand2 = new Hand(new Player());
            hand1.captured.push(new Card(Face.Seven, Suit.Clubs));
            hand1.captured.push(new Card(Face.Seven, Suit.Coins));
            hand1.captured.push(new Card(Face.Six, Suit.Swords));
            hand1.captured.push(new Card(Face.Six, Suit.Cups));

            hand2.captured.push(new Card(Face.Six, Suit.Clubs));
            hand2.captured.push(new Card(Face.Six, Suit.Coins));
            hand2.captured.push(new Card(Face.Seven, Suit.Swords));
            hand2.captured.push(new Card(Face.Seven, Suit.Cups));

            const scores = new PrimeScores().calculateScores([ hand1, hand2 ]);
            const hand1Score = scores.find(score => score.player.equals(hand1.player));
            const hand2Score = scores.find(score => score.player.equals(hand2.player));
            expect(hand1Score?.score).to.equal(0);
            expect(hand2Score?.score).to.equal(0);
        });

        it("Calculates prime - awards point to player with higher score", () => {
            const hand1 = new Hand(new Player());
            const hand2 = new Hand(new Player());
            hand1.captured.push(new Card(Face.Seven, Suit.Clubs));
            hand1.captured.push(new Card(Face.Seven, Suit.Coins));
            hand1.captured.push(new Card(Face.Six, Suit.Swords));
            hand1.captured.push(new Card(Face.Six, Suit.Cups));

            hand2.captured.push(new Card(Face.Six, Suit.Clubs));
            hand2.captured.push(new Card(Face.Six, Suit.Coins));
            hand2.captured.push(new Card(Face.Seven, Suit.Swords));
            hand2.captured.push(new Card(Face.Five, Suit.Cups));

            const scores = new PrimeScores().calculateScores([ hand1, hand2 ]);
            const hand1Score = scores.find(score => score.player.equals(hand1.player));
            const hand2Score = scores.find(score => score.player.equals(hand2.player));
            expect(hand1Score?.score).to.equal(1);
            expect(hand2Score?.score).to.equal(0);
        });
    });

    describe("calculatePrime", () =>  {
        [
            { face: Face.Seven, faceOneLower: Face.Six, expectedScore: 21 },
            { face: Face.Six, faceOneLower: Face.Ace, expectedScore: 18 },
            { face: Face.Ace, faceOneLower: Face.Five, expectedScore: 16 },
            { face: Face.Five, faceOneLower: Face.Four, expectedScore: 15 },
            { face: Face.Four, faceOneLower: Face.Three, expectedScore: 14 },
            { face: Face.Three, faceOneLower: Face.Two, expectedScore: 13 },
            { face: Face.Two, faceOneLower: Face.Knight, expectedScore: 12 },
            { face: Face.Knight, faceOneLower: Face.Knave, expectedScore: 10 },
            { face: Face.Knave, faceOneLower: Face.King, expectedScore: 10 },
            { face: Face.King, faceOneLower: null, expectedScore: 10 },
        ].forEach(testCase => {
            it("Calculates prime - tie when equal", () => {
                const cards = [
                    new Card(testCase.face, Suit.Clubs),
                ];
                if(testCase.faceOneLower) {
                    cards.push(new Card(testCase.faceOneLower, Suit.Clubs))
                }
                const primeScore = new PrimeScores().calculatePrime(cards, Suit.Clubs);
                expect(primeScore).to.equal(testCase.expectedScore);
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