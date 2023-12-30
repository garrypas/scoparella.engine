import { RuleEngine } from "./RuleEngine";
import { PlayCardValidationResult } from "./PlayCardValidationResult";
import { Card } from "../models/Card";
import { Face } from "../models/Face";
import { Suit } from "../models/Suit";

let _ruleEngine: RuleEngine;

beforeEach(() => {
    _ruleEngine = new RuleEngine();
});

describe("RuleEngine tests", () => {
    describe("validPlay", () => {
        it(`Attempt to take card that is not on the table - ${PlayCardValidationResult.TABLE_MISSING_REQUESTED_CARDS} result`, () => {
            const cardToPlay = new Card(Face.Ace, Suit.Clubs);
            const cardToTake = new Card(Face.Ace, Suit.Coins);
            const otherCard = new Card(Face.Five, Suit.Clubs);
            const cardsOnTable = [ otherCard ]
            const result = _ruleEngine.validPlay(cardToPlay, [ cardToTake ], cardsOnTable);
            expect(result).toEqual(PlayCardValidationResult.TABLE_MISSING_REQUESTED_CARDS);
        });

        it(`taking - exact - match between card played and card requested - ${PlayCardValidationResult.OK}`, () => {
            const cardToPlay = new Card(Face.Ace, Suit.Clubs);
            const cardToTake = new Card(Face.Ace, Suit.Coins);
            const otherCard = new Card(Face.Five, Suit.Clubs);
            const cardsOnTable = [ cardToTake, otherCard ]
            const result = _ruleEngine.validPlay(cardToPlay, [ cardToTake ], cardsOnTable);
            expect(result).toEqual(PlayCardValidationResult.OK);
        });

        it(`taking - exact - face values don't match - ${PlayCardValidationResult.FACE_VALUES_DO_NOT_MATCH}`, () => {
            const cardToPlay = new Card(Face.Ace, Suit.Clubs);
            const cardToTake = new Card(Face.Six, Suit.Coins);
            const otherCard = new Card(Face.Five, Suit.Clubs);
            const cardsOnTable = [ cardToTake, otherCard ]
            const result = _ruleEngine.validPlay(cardToPlay, [ cardToTake ], cardsOnTable);
            expect(result).toEqual(PlayCardValidationResult.FACE_VALUES_DO_NOT_MATCH);
        });

        it(`taking - many - face value matches sum of face values and no exact match is on the table - ${PlayCardValidationResult.OK}`, () => {
            const cardToPlay = new Card(Face.Three, Suit.Clubs);
            const card1 = new Card(Face.Ace, Suit.Coins);
            const card2 = new Card(Face.Two, Suit.Coins);
            const cardsOnTable = [ card1, card2 ]
            const result = _ruleEngine.validPlay(cardToPlay, [ card1, card2 ], cardsOnTable);
            expect(result).toEqual(PlayCardValidationResult.OK);
        });

        it(`taking - many - sum of face values ok, but there is an exact match is on the table - ${PlayCardValidationResult.CANNOT_TAKE_MANY_BECAUSE_EXACT_MATCH_ON_TABLE}`, () => {
            const cardToPlay = new Card(Face.Three, Suit.Clubs);
            const card1 = new Card(Face.Ace, Suit.Coins);
            const card2 = new Card(Face.Two, Suit.Coins);
            const card3 = new Card(Face.Three, Suit.Coins);
            const cardsOnTable = [ card1, card2, card3 ]
            const result = _ruleEngine.validPlay(cardToPlay, [ card1, card2 ], cardsOnTable);
            expect(result).toEqual(PlayCardValidationResult.CANNOT_TAKE_MANY_BECAUSE_EXACT_MATCH_ON_TABLE);
        });

        it(`taking - many - card played face value doesn't match sum of face values requested - ${PlayCardValidationResult.FACE_VALUES_DO_NOT_MATCH}`, () => {
            const cardToPlay = new Card(Face.Three, Suit.Clubs);
            const card1 = new Card(Face.Two, Suit.Coins);
            const card2 = new Card(Face.Five, Suit.Coins);
            const cardsOnTable = [ card1, card2 ]
            const result = _ruleEngine.validPlay(cardToPlay, [ card1, card2 ], cardsOnTable);
            expect(result).toEqual(PlayCardValidationResult.FACE_VALUES_DO_NOT_MATCH);
        });

        it(`playing - attempt to play card without taking - ${PlayCardValidationResult.OK}`, () => {
            const cardToPlay = new Card(Face.Four, Suit.Clubs);
            const card1 = new Card(Face.Ace, Suit.Coins);
            const card2 = new Card(Face.Two, Suit.Coins);
            const cardsOnTable = [ card1, card2 ]
            const result = _ruleEngine.validPlay(cardToPlay, [ ], cardsOnTable);
            expect(result).toEqual(PlayCardValidationResult.OK);
        });

        it(`playing - attempt to play card without taking when a sum match is available - ${PlayCardValidationResult.CANNOT_LAY_CARD_MATCH_EXISTS}`, () => {
            const cardToPlay = new Card(Face.Three, Suit.Clubs);
            const card1 = new Card(Face.Ace, Suit.Coins);
            const card2 = new Card(Face.Two, Suit.Coins);
            const cardsOnTable = [ card1, card2 ]
            const result = _ruleEngine.validPlay(cardToPlay, [ ], cardsOnTable);
            expect(result).toEqual(PlayCardValidationResult.CANNOT_LAY_CARD_MATCH_EXISTS);
        });

        it(`playing - attempt to play card without taking when an exact match is available - ${PlayCardValidationResult.CANNOT_LAY_CARD_MATCH_EXISTS}`, () => {
            const cardToPlay = new Card(Face.Three, Suit.Clubs);
            const card1 = new Card(Face.Three, Suit.Coins);
            const cardsOnTable = [ card1 ]
            const result = _ruleEngine.validPlay(cardToPlay, [ ], cardsOnTable);
            expect(result).toEqual(PlayCardValidationResult.CANNOT_LAY_CARD_MATCH_EXISTS);
        });
    });

    describe("isScopa", () => {
        test("isScopa is true when table is cleared", () => {
            const isScopa = _ruleEngine.isScopa([new Card(Face.Ace, Suit.Clubs)], [] );
            expect(isScopa).toBeTruthy();
        });

        test("isScopa is false when table no card is taken", () => {
            const isScopa = _ruleEngine.isScopa([], [new Card(Face.Ace, Suit.Clubs)] );
            expect(isScopa).not.toBeTruthy();
        });

        test("isScopa is false when table is not cleared", () => {
            const isScopa = _ruleEngine.isScopa([new Card(Face.Ace, Suit.Clubs)], [new Card(Face.Two, Suit.Clubs)] );
            expect(isScopa).not.toBeTruthy();
        });
    });
});