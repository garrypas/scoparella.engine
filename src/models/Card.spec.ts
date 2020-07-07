import { Card } from "./Card";
import { Face } from "./Face";
import { Suit } from "./Suit";
import { expect } from "chai";

describe("Card tests", function () {
    let _card: Card;

    beforeEach(() => {
        _card = new Card(Face.Seven, Suit.Clubs);
    });

    it("equals() is a match when card has same suit and face", () => {
        expect(_card.equals(new Card(_card.face, _card.suit))).to.be.true;
    });

    it("equals() is not a match when card has different suit", () => {
        expect(_card.equals(new Card(_card.face, Suit.Coins))).not.to.be.true;
    });

    it("equals() is not a match when card has different face", () => {
        expect(_card.equals(new Card(Face.Two, _card.suit))).not.to.be.true;
    });

    it("suitEquals() is a match when card has same suit", () => {
        expect(_card.suitEquals(new Card(_card.face, _card.suit))).to.be.true;
    });

    it("suitEquals() is not a match when card has different suit", () => {
        expect(_card.suitEquals(new Card(_card.face, Suit.Coins))).not.to.be.true;
    });

    it("faceEquals() is a match when card has same face", () => {
        expect(_card.faceEquals(new Card(_card.face, _card.suit))).to.be.true;
    });

    it("faceEquals() is not a match when card has different face", () => {
        expect(_card.faceEquals(new Card(Face.Two, _card.suit))).not.to.be.true;
    });

    it("getFaceSumMatches() finds matches when present", () => {
        const matches = _card.getFaceSumMatches([
            new Card(Face.Two, Suit.Clubs), new Card(Face.Ace, Suit.Swords), new Card(Face.Two, Suit.Swords), new Card(Face.Three, Suit.Swords)
        ]);
        expect(matches).to.have.lengthOf(1);
        expect(Card.sumFaces(matches[0])).to.equal(7);
    });

    it("sumFaces() sums", () => {
        const sum = Card.sumFaces([new Card(Face.Two, Suit.Clubs), new Card(Face.Ace, Suit.Swords)]);
        expect(sum).to.equal(3);
    })
});