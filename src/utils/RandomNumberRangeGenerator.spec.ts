"use strict";

import { expect } from "chai";
import { RandomNumberRangeGenerator } from "./RandomNumberRangeGenerator";

describe("RandomNumberRangeGenerator tests", function () {
    it("generateRange() - generates a range of unique integer values up to but not including the range, shuffled", function () {
        this.retries(10);
        const ensureItemsAreNotInSequentialOrder = (items: number[]) => {
            let itemOutOfPosition: boolean = false;
            for(let i = 0; i < items.length; i++) {
                expect(items).to.contain(i);
                itemOutOfPosition = itemOutOfPosition || items[i] != i;
            }
            expect(itemOutOfPosition, "Items are sequential. Although non-deterministic, the probability of 10000 items randomly appearing in sequential order 10 times in a row is vanishingly small, so this is almost certainly a bug").to.be.true;
        };

        const SIZE: number = 10000;
        const result = RandomNumberRangeGenerator.generateRange(SIZE);
        expect(result).to.have.lengthOf(SIZE);
        ensureItemsAreNotInSequentialOrder(result);
    });
});