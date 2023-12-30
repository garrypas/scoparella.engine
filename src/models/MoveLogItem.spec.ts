import { MoveLogItem } from "./MoveLogItem";
import { Card } from "./Card";
import { Face } from "./Face";
import { Suit } from "./Suit";
import { Player } from "./Player";
import { ComparableArray } from "../core/ComparableArray";

describe("MoveLogItem tests", () => {
    describe("serialization/deserialization", () => {
        let _moveLogItem: MoveLogItem[];

        beforeEach(() =>
            _moveLogItem = [
                new MoveLogItem(
                    new Card(Face.Three, Suit.Clubs),
                    [new Card(Face.Ace, Suit.Clubs), new Card(Face.Two, Suit.Clubs)],
                    "123",
                    new Player(),
                    true
                )
            ]);

        [{ fromMethod: "fromDtoArray", toMethod: "toDtoArray" }, { fromMethod: "fromDto", toMethod: "toDto" }].forEach(testData =>
            describe(`${testData.fromMethod}/${testData.toMethod}() serializes/deserializes`, () => {
                let _moveLogItemAfter: MoveLogItem[];

                beforeEach(() => {
                    if (testData.fromMethod === "fromDto") {
                        _moveLogItemAfter = [MoveLogItem.fromDto(MoveLogItem.toDto(_moveLogItem[0]))];
                    }
                    else {
                        _moveLogItem.push(
                            new MoveLogItem(new Card(Face.Three, Suit.Swords), [new Card(Face.Ace, Suit.Swords), new Card(Face.Two, Suit.Swords)], "456", new Player(), false)
                        );
                        _moveLogItemAfter = MoveLogItem.fromDtoArray(MoveLogItem.toDtoArray(_moveLogItem));
                    }
                });

                test("serializes/deserializes length is correct", () =>
                    expect(_moveLogItemAfter).toHaveLength(_moveLogItem.length));

                test("serializes/deserializes cards", () =>
                    _moveLogItemAfter.forEach((_, i) =>
                        expect(_moveLogItemAfter[i].card?.equals(_moveLogItem[i].card!)).toBeTruthy()));

                test("serializes/deserializes players", () =>
                    _moveLogItemAfter.forEach((_, i) =>
                        expect(_moveLogItemAfter[i].player.equals(_moveLogItem[i].player)).toBeTruthy));

                test("serializes/deserializes isScopa", () =>
                    _moveLogItemAfter.forEach((_, i) =>
                        expect(_moveLogItemAfter[i].isScopa).toEqual(_moveLogItem[i].isScopa)));

                test("serializes/deserializes taken elements", () =>
                    _moveLogItemAfter.forEach((_, i) =>
                        expect(ComparableArray.allMatch(_moveLogItemAfter[i].taken, _moveLogItem[i].taken))));

                test("serializes/deserializes timestamp", () =>
                    _moveLogItemAfter.forEach((_, i) =>
                        expect(_moveLogItemAfter[i].timestamp).toEqual(_moveLogItem[i].timestamp)));
            })
        );
    });
});
