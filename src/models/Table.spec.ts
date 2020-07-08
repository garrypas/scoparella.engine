import { expect } from "chai";
import { 
    Table,
    CARDS_NOT_ON_TABLE
} from "./Table";
import { Card } from "./Card";
import { Face } from "./Face";
import { Suit } from "./Suit";
import { ComparableArray } from "../core/ComparableArray";

describe("Table tests", () => {
    let _table: Table;
    let _card1: Card, _card2: Card, _card3: Card, _card4: Card;

    beforeEach(() => {
        _card1 = new Card(Face.Ace, Suit.Clubs);
        _card2 = new Card(Face.Two, Suit.Coins);
        _card3 = new Card(Face.Three, Suit.Cups);
        _card4 = new Card(Face.Four, Suit.Swords);
        _table = new Table();
        _table.flop([ _card1, _card2, _card3, _card4 ]);
    });

    it("Flop is laid on table", () => {
        expect(_table.cards).to.have.lengthOf(4);
        expect(_table.cards[0]).to.equal(_card1);
        expect(_table.cards[1]).to.equal(_card2);
        expect(_table.cards[2]).to.equal(_card3);
        expect(_table.cards[3]).to.equal(_card4);
    });

    it("remove() returns the correct cards from table", () => {
        const result: Card[] = _table.remove([
            new Card(_card1.face, _card1.suit),
            new Card(_card2.face, _card2.suit),
        ]);
        expect(result).to.be.lengthOf(2);
        expect(result[0].equals(_card1)).to.be.true;
        expect(result[1].equals(_card2)).to.be.true;
    });

    it("remove() the cards remaining on the table are correct", () => {
        _table.remove([
            new Card(_card1.face, _card1.suit),
            new Card(_card2.face, _card2.suit),
        ]);
        expect(_table).to.be.lengthOf(2);
        expect(_table.cards[0].equals(_card3)).to.be.true;
        expect(_table.cards[1].equals(_card4)).to.be.true;
    });

    it("remove() throws error if the card isn't on the table", () => {
        expect(() => _table.remove(new Card(Face.Five, Suit.Clubs))).to.throw(CARDS_NOT_ON_TABLE);
    });

    it("removeAll() removes all cards from the table", () => {
        _table.removeAll();
        expect(_table.cards).to.be.lengthOf(0);
    });

    it("removeAll() returns cards removed", () => {
        const removed = _table.removeAll();
        expect(removed).to.be.lengthOf(4);
    });

    it("add() adds a card to the cards on the table", () => {
        const card5: Card = new Card(Face.Two, Suit.Clubs);
        _table.add(card5);
        expect(_table.cards).to.have.lengthOf(5);
        expect(_table.cards).to.contain(card5);
    });

    it("add() throws error if the card is already on the table", () => {
        expect(() => _table.add(_card1)).to.throw(`The card with the face ${_card1.face} and suit ${_card1.suit} is already on the table`);
    });

    it("fromDto() makes a copy of the Table instance", () => {
        const card5: Card = new Card(Face.Two, Suit.Clubs);
        _table.add(card5);
        const tableAfter = Table.fromDto(Table.toDto(_table));
        expect(ComparableArray.allMatch(tableAfter.cards, _table.cards)).to.be.true;
    });
});