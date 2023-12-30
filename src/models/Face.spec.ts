import { Face, getFaceValue } from "./Face";

describe("Face tests", function () {
    test("Correct numeric face values", () => {
        expect(getFaceValue(Face.Ace)).toEqual(1);
        expect(getFaceValue(Face.Two)).toEqual(2);
        expect(getFaceValue(Face.Three)).toEqual(3);
        expect(getFaceValue(Face.Four)).toEqual(4);
        expect(getFaceValue(Face.Five)).toEqual(5);
        expect(getFaceValue(Face.Six)).toEqual(6);
        expect(getFaceValue(Face.Seven)).toEqual(7);
        expect(getFaceValue(Face.Knave)).toEqual(8);
        expect(getFaceValue(Face.Knight)).toEqual(9);
        expect(getFaceValue(Face.King)).toEqual(10);
    });
});