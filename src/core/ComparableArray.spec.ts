import { expect } from "chai";
import { ComparableArray } from "./ComparableArray";
import { IComparable } from "./IComparable";

class ComparableMock implements IComparable {
    private _num: number;
    constructor(num: number) {
        this._num = num;
    }
    equals(other: ComparableMock): boolean {
        return other._num === this._num;
    }
}

describe("ComparableArray tests", function () {
    describe("allMatch()", () => {
        [
            {set: [1,2], superset: [1,2], expected: true},
            {set: [1,2], superset: [1,2,3], expected: false},
            {set: [1,2,3], superset: [1,2], expected: false},
        ].forEach(testData => {
            it(`${testData.expected} when comparing [${testData.set}] to [${testData.superset}]`, () => {
                const set = testData.set.map(i => new ComparableMock(i));
                const superset = testData.superset.map(i => new ComparableMock(i));
                expect(ComparableArray.allMatch(set, superset)).to.equal(testData.expected)
            });
        });
    });

    describe("findItem()", () => {
        it("finds item when it is in the set", () => {
            const item = new ComparableMock(1);
            const set = [1, 2].map(i => new ComparableMock(i));
            expect(ComparableArray.findItem(item, set)).not.to.be.undefined;
        });

        it("throws when item is not in the set", () => {
            const item = new ComparableMock(3);
            const set = [1, 2].map(i => new ComparableMock(i));
            expect(() => ComparableArray.findItem(item, set)).to.throw;
        });
    });

    describe("hasItem()", () => {
        it("has item is true when it is in the set", () => {
            const item = new ComparableMock(1);
            const set = [1, 2].map(i => new ComparableMock(i));
            expect(ComparableArray.hasItem(item, set)).to.be.true;
        });

        it("has item is false when item is not in the set", () => {
            const item = new ComparableMock(3);
            const set = [1, 2].map(i => new ComparableMock(i));
            expect(ComparableArray.hasItem(item, set)).to.be.false;
        });
    });

    describe("isSubset()", () => {
        [
            {set: [1,2], superset: [1,2], expected: true},
            {set: [1,2], superset: [1,2,3], expected: true},
            {set: [1,2,3], superset: [1,2], expected: false},
        ].forEach(testData => {
            it(`${testData.expected} when comparing [${testData.set}] to [${testData.superset}]`, () => {
                const set = testData.set.map(i => new ComparableMock(i));
                const superset = testData.superset.map(i => new ComparableMock(i));
                expect(ComparableArray.isSubset(set, superset)).to.equal(testData.expected)
            });
        });
    });
});