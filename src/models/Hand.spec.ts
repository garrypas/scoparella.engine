import { Hand } from "./Hand";
import { Player } from "./Player";
import { expect } from "chai";
import { IdGenerator } from "../utils/IdGenerator";
import { Card } from "./Card";
import { Face } from "./Face";
import { Suit } from "./Suit";
import { SinonSandbox, createSandbox } from "sinon";
import { ComparableArray } from "../core/ComparableArray";

describe("Hand tests", function () {
    let _hand: Hand;
    let _player: Player;
    beforeEach(() => {
        _player = new Player();
        _hand = new Hand(_player);
     });

    describe("equals()", () => {
        let _player1: Player;
        let _player1Copy: Player;
        let _player2: Player;
        let _sandbox: SinonSandbox;

        beforeEach(() => {
            _sandbox = createSandbox();
            const ids = ["p2", "p1", "p1"];
            _sandbox.stub(IdGenerator, "generateId").callsFake(() => ids.pop() || "oops");
            [ _player1, _player1Copy, _player2 ] = [ new Player(), new Player(), new Player() ];
        });

        afterEach(() => {
            _sandbox.restore();
        });

        it("is true when players match", () => {
            const [ hand1, hand2 ] = [ new Hand(_player1), new Hand(_player1Copy) ]
            expect(hand1.equals(hand2)).to.be.true;
        });

        it("is false when players do not match", () => {
            const [ hand1, hand2 ] = [ new Hand(_player1), new Hand(_player2) ]
            expect(hand1.equals(hand2)).not.to.be.true;
        });
    });

    describe("hasCard()", () => {
        it("true when hand contains card", () => {
            _hand.add(new Card(Face.Ace, Suit.Clubs));
            expect(_hand.hasCard(new Card(Face.Ace, Suit.Clubs))).to.be.true;
        });

        it("false when hand does not contain card", () => {
            _hand.add(new Card(Face.Ace, Suit.Clubs));
            expect(_hand.hasCard(new Card(Face.Three, Suit.Clubs))).not.to.be.true;
        });
    });

    describe("remove()", () => {
        it("removes the card from the player's hand", () => {
            _hand.add(new Card(Face.Ace, Suit.Clubs));
            _hand.remove(new Card(Face.Ace, Suit.Clubs))
            expect(_hand.cards).is.empty;
        });

        it("Returns the removed card", () => {
            const [ card1, card2 ] = [ new Card(Face.Ace, Suit.Clubs), new Card(Face.Two, Suit.Clubs) ]
            _hand.add([card1, card2]);
            const removed = _hand.remove(card1)
            expect(removed.equals(card1)).is.true;
        });

        it("Throws error if the card isn't in the player's hand", () => {
            expect(() => _hand.remove(new Card(Face.Ace, Suit.Clubs))).to.throw;
        });
    });

    describe("fromDto/toDto() serializes/deserializes the Hand instance", () => {
        let _handAfter: Hand;
        let _card1: Card, _card2: Card, card3: Card;
        beforeEach(() => {
            [ _card1, _card2, card3 ] = [ new Card(Face.Ace, Suit.Clubs), new Card(Face.Two, Suit.Clubs), new Card(Face.Five, Suit.Clubs) ]
            _hand.add([_card1, _card2]);
            _hand.capture(card3)
            _handAfter = Hand.fromDto(Hand.toDto(_hand));
        });

        it("cards serialized/deserialized", () => {
            expect(_handAfter.cards).to.have.lengthOf(2);
            expect(_handAfter.hasCard(_card1)).to.be.true;
            expect(_handAfter.hasCard(_card2)).to.be.true;
        });

        it("captured serialized/deserialized", () => {
            expect(_handAfter.captured).to.have.lengthOf(1);
            expect(ComparableArray.hasItem(card3, _handAfter.captured)).to.be.true;
        });

        it("player serialized/deserialized", () => {
            expect(_handAfter.player.equals(_player)).to.be.true;
        });
    });

    describe("fromDtoArray/toDtoArray() serializes/deserializes the Hand array", () => {
        let _handsAfter: Hand[];
        let _hand2: Hand;
        let _card1: Card, _card2: Card, _card3: Card;
        let _card4: Card, _card5: Card, _card6: Card;
        let _player2: Player;
        beforeEach(() => {
            [ _card1, _card2, _card3 ] = [ new Card(Face.Ace, Suit.Clubs), new Card(Face.Two, Suit.Clubs), new Card(Face.Five, Suit.Clubs) ]
            _hand.add([_card1, _card2]);
            _hand.capture(_card3);

            _player2 = new Player();
            [ _card4, _card5, _card6 ] = [ new Card(Face.Ace, Suit.Coins), new Card(Face.Two, Suit.Coins), new Card(Face.Five, Suit.Coins) ]
            _hand2 = new Hand(_player2);
            _hand2.add([_card4 ]);
            _hand2.capture([_card5, _card6])

            _handsAfter = Hand.fromDtoArray(Hand.toDtoArray([ _hand, _hand2 ]));
        });

        it("cards serialized/deserialized", () => {
            expect(_handsAfter[0].cards).to.have.lengthOf(2);
            expect(ComparableArray.isSubset([ _card1, _card2 ], _handsAfter[0].cards)).to.be.true;

            expect(_handsAfter[1].cards).to.have.lengthOf(1);
            expect(_handsAfter[1].hasCard(_card4)).to.be.true;
        });

        it("captured serialized/deserialized", () => {
            expect(_handsAfter[0].captured).to.have.lengthOf(1);
            expect(ComparableArray.hasItem(_card3, _handsAfter[0].captured)).to.be.true;

            expect(_handsAfter[1].captured).to.have.lengthOf(2);
            expect(ComparableArray.isSubset([ _card5, _card6 ], _handsAfter[1].captured)).to.be.true;
        });

        it("player serialized/deserialized", () => {
            expect(_handsAfter[0].player.equals(_player)).to.be.true;
            expect(_handsAfter[1].player.equals(_player2)).to.be.true;
        });
    });

    describe("capture()", () => {
        it("captures single", () => {
            _hand.capture(new Card(Face.Ace, Suit.Clubs));
            expect(_hand.captured).to.have.lengthOf(1);
        });

        it("captures many", () => {
            _hand.capture([ new Card(Face.Ace, Suit.Clubs), new Card(Face.Ace, Suit.Coins) ]);
            expect(_hand.captured).to.have.lengthOf(2);
        });
    });
});