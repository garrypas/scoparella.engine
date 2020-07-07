import { Face, getFaceValue } from "./Face";
import { expect } from "chai";

describe("Face tests", function () {
    it("Correct numeric face values", () => {
        expect(getFaceValue(Face.Ace)).to.equal(1);
        expect(getFaceValue(Face.Two)).to.equal(2);
        expect(getFaceValue(Face.Three)).to.equal(3);
        expect(getFaceValue(Face.Four)).to.equal(4);
        expect(getFaceValue(Face.Five)).to.equal(5);
        expect(getFaceValue(Face.Six)).to.equal(6);
        expect(getFaceValue(Face.Seven)).to.equal(7);
        expect(getFaceValue(Face.Knave)).to.equal(8);
        expect(getFaceValue(Face.Knight)).to.equal(9);
        expect(getFaceValue(Face.King)).to.equal(10);
    });
});