import { MoveLogItem } from "./MoveLogItem";
import { Card } from "./Card";
import { Face } from "./Face";
import { Suit } from "./Suit";
import { Player } from "./Player";
import { expect } from "chai";
import { ComparableArray } from "../core/ComparableArray";

describe("MoveLogItem tests", () => {
    describe("fromDto/toDto() serializes/deserializes the MoveLogItem instance", () => {
        let _moveLogItem: MoveLogItem;
        let _moveLogItemAfter: MoveLogItem;
        let _cardPlayed: Card;
        let _taken1: Card, _taken2: Card;
        let _timestamp: string;
        let _isScopa: boolean;
        let _player: Player;
        beforeEach(() => {
            _cardPlayed = new Card(Face.Three, Suit.Clubs);
            [ _taken1, _taken2 ] = [ new Card(Face.Ace, Suit.Clubs), new Card(Face.Two, Suit.Clubs) ]
            _timestamp = "123";
            _isScopa = true;
            _player = new Player();
            _moveLogItem = new MoveLogItem(
                _cardPlayed,
                [_taken1, _taken2 ],
                _timestamp,
                _player,
                _isScopa
            );
            _moveLogItemAfter = MoveLogItem.fromDto(MoveLogItem.toDto(_moveLogItem));
        });

        it("serializes/deserializes card", () => {
            expect(_moveLogItemAfter.card.equals(_moveLogItem.card)).to.be.true;
        });

        it("serializes/deserializes player", () => {
            expect(_moveLogItemAfter.player.equals(_moveLogItem.player)).to.be.true;
        });

        it("serializes/deserializes taken", () => {
            expect(_moveLogItemAfter.isScopa).to.equal(_moveLogItem.isScopa);
        });

        it("serializes/deserializes taken", () => {
            expect(ComparableArray.allMatch(_moveLogItemAfter.taken, _moveLogItem.taken)).to.be.true;
        });

        it("serializes/deserializes timestamp", () => {
            expect(_moveLogItemAfter.timestamp).to.equals(_moveLogItem.timestamp);
        });
    });
});
