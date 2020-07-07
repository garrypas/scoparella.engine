import { expect } from "chai";
import { Deck } from "./Deck";
import { RandomNumberRangeGenerator } from "../utils/RandomNumberRangeGenerator";
import { Face } from "./Face";
import { Suit } from "./Suit";
import { SinonSandbox, createSandbox } from "sinon";

function generateRangeStub(scale: number) : number[] {
    const result: number[] = [];
    for(let i = 0; i < scale; i++) {
        result.push(i);
    }
    return result;
}

describe("Deck tests", function () {
    let _deck: Deck;
    let _sandbox: SinonSandbox;

    beforeEach(() => {
        _sandbox = createSandbox();
        _sandbox.stub(RandomNumberRangeGenerator, "generateRange").callsFake(generateRangeStub);
        _deck = new Deck();
    });

    afterEach(() => {
        _sandbox.restore();
    })

    it("Has 40 cards on initialization", () => {
        expect(_deck.remaining).to.equal(40);
    });

    it("Takes cards", () => {
        const card1 = _deck.take()[0];
        expect(card1.face).to.equal(Face.King);
        expect(card1.suit).to.equal(Suit.Clubs);
        expect(_deck.remaining).to.equal(39);

        _deck.take(4)
        expect(_deck.remaining).to.equal(35);

        const card2 = _deck.take()[0];
        expect(card2.face).to.equal(Face.Knight);
        expect(card2.suit).to.equal(Suit.Cups);
        expect(_deck.remaining).to.equal(34);
    });
});