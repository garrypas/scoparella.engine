import { getCombinations } from "./getCombinations"
import { expect } from "chai";

describe("getCombinations() tests", () => {
    it("Play a game to conclusion", () => {
        const arr: number[] = [ 1,2,3 ];
        const result = getCombinations( arr );

        expect(result).to.have.lengthOf(7);
        [
            [1],[2],[3],
            [1,2],[1,3],[2,3],
            [1,2,3]
        ].forEach(testCase => {
            expect(result.find(r => testCase.every(t => r.includes(t)) )).to.have.lengthOf(testCase.length);
        });
    });
});