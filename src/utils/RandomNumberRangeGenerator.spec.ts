import { RandomNumberRangeGenerator } from './RandomNumberRangeGenerator';

describe('RandomNumberRangeGenerator tests', function () {
  test('generateRange() - generates a range of unique integer values up to but not including the range, shuffled', function () {
    let attempts = 0;
    while (attempts < 10) {
      const ensureItemsAreNotInSequentialOrder = (items: number[]) => {
        let itemOutOfPosition: boolean = false;
        for (let i = 0; i < items.length; i++) {
          expect(items).toContain(i);
          itemOutOfPosition = itemOutOfPosition || items[i] != i;
        }
        // Items are sequential. Although non-deterministic, the probability of 10000 items randomly appearing in sequential order 10 times in a row is vanishingly small, so this is almost certainly a bug
        expect(itemOutOfPosition).toBeTruthy();
      };

      const SIZE: number = 10000;
      const result = RandomNumberRangeGenerator.generateRange(SIZE);
      expect(result).toHaveLength(SIZE);
      ensureItemsAreNotInSequentialOrder(result);
      break;
    }
  });
});
