import { Hand } from "./Hand";
import { Player } from "./Player";
import { expect } from "chai";
import { IdGenerator } from "../utils/IdGenerator";
import { Card } from "./Card";
import { Face } from "./Face";
import { Suit } from "./Suit";
import { SinonSandbox, createSandbox } from "sinon";

describe("Hand tests", function () {
    describe("equals()", () => {
        let _player1: Player;
        let _player1Copy: Player;
        let _player2: Player;
        let _sandbox: SinonSandbox;

        beforeEach(() => {
            _sandbox = createSandbox();
            const ids = ["p2", "p1", "p1"];
            _sandbox.stub(IdGenerator, "generateId").callsFake(() => ids.pop() || "oops");
            _player1 = new Player();
            _player1Copy = new Player();
            _player2 = new Player();
        });

        afterEach(() => {
            _sandbox.restore();
        });

        it("is true when players match", () => {
            const hand1 = new Hand(_player1);
            const hand2 = new Hand(_player1Copy);
            expect(hand1.equals(hand2)).to.be.true;
        });

        it("is false when players do not match", () => {
            const hand1 = new Hand(_player1);
            const hand2 = new Hand(_player2);
            expect(hand1.equals(hand2)).not.to.be.true;
        });
    });

    describe("hasCard()", () => {
        it("true when hand contains card", () => {
            const hand = new Hand(new Player());
            hand.cards.push(new Card(Face.Ace, Suit.Clubs));
            expect(hand.hasCard(new Card(Face.Ace, Suit.Clubs))).to.be.true;
        });

        it("false when hand does not contain card", () => {
            const hand = new Hand(new Player());
            hand.cards.push(new Card(Face.Ace, Suit.Clubs));
            expect(hand.hasCard(new Card(Face.Three, Suit.Clubs))).not.to.be.true;
        });
    });

    describe("remove()", () => {
        it("removes the card from the player's hand", () => {
            const hand = new Hand(new Player());
            hand.cards.push(new Card(Face.Ace, Suit.Clubs));
            hand.remove(new Card(Face.Ace, Suit.Clubs))
            expect(hand.cards).is.empty;
        });

        it("Returns the removed card", () => {
            const hand = new Hand(new Player());
            hand.cards.push(new Card(Face.Ace, Suit.Clubs));
            hand.cards.push(new Card(Face.Two, Suit.Clubs));
            const removed = hand.remove(new Card(Face.Ace, Suit.Clubs))
            expect(removed.equals(new Card(Face.Ace, Suit.Clubs))).is.true;
        });

        it("Throws error if the card isn't in the player's hand", () => {
            const hand = new Hand(new Player());
            expect(() => hand.remove(new Card(Face.Ace, Suit.Clubs))).to.throw;
        });
    });
});