import { ComparableArray } from './ComparableArray';
import { Comparable } from './Comparable';

class ComparableMock implements Comparable {
  private num: number;
  constructor(num: number) {
    this.num = num;
  }
  equals(other: ComparableMock): boolean {
    return other.num === this.num;
  }
}

describe('ComparableArray tests', function () {
  describe('allMatch()', () => {
    [
      { set: [1, 2], superset: [1, 2], expected: true },
      { set: [1, 2], superset: [1, 2, 3], expected: false },
      { set: [1, 2, 3], superset: [1, 2], expected: false },
    ].forEach((testData) => {
      it(`${testData.expected} when comparing [${testData.set}] to [${testData.superset}]`, () => {
        const set = testData.set.map((i) => new ComparableMock(i));
        const superset = testData.superset.map((i) => new ComparableMock(i));
        expect(ComparableArray.allMatch(set, superset)).toEqual(
          testData.expected,
        );
      });
    });
  });

  describe('findItem()', () => {
    test('finds item when it is in the set', () => {
      const item = new ComparableMock(1);
      const set = [1, 2].map((i) => new ComparableMock(i));
      expect(ComparableArray.findItem(item, set)).not.toBeUndefined();
    });

    test('throws when item is not in the set', () => {
      const item = new ComparableMock(3);
      const set = [1, 2].map((i) => new ComparableMock(i));
      expect(() => ComparableArray.findItem(item, set)).toThrow();
    });
  });

  describe('hasItem()', () => {
    test('has item is true when it is in the set', () => {
      const item = new ComparableMock(1);
      const set = [1, 2].map((i) => new ComparableMock(i));
      expect(ComparableArray.hasItem(item, set)).toBeTruthy();
    });

    test('has item is false when item is not in the set', () => {
      const item = new ComparableMock(3);
      const set = [1, 2].map((i) => new ComparableMock(i));
      expect(ComparableArray.hasItem(item, set)).toBeFalsy();
    });
  });

  describe('isSubset()', () => {
    [
      { set: [1, 2], superset: [1, 2], expected: true },
      { set: [1, 2], superset: [1, 2, 3], expected: true },
      { set: [1, 2, 3], superset: [1, 2], expected: false },
    ].forEach((testData) => {
      it(`${testData.expected} when comparing [${testData.set}] to [${testData.superset}]`, () => {
        const set = testData.set.map((i) => new ComparableMock(i));
        const superset = testData.superset.map((i) => new ComparableMock(i));
        expect(ComparableArray.isSubset(set, superset)).toEqual(
          testData.expected,
        );
      });
    });
  });
});
