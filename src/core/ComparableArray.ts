import { Comparable } from './Comparable';

export class ComparableArray {
  static hasItem<T extends Comparable<unknown>>(item: T, set: T[]): boolean {
    return set.findIndex((thisItem) => item.equals(thisItem)) >= 0;
  }

  static findItem<T extends Comparable<unknown>>(item: T, set: T[]) {
    const result = set.find((thisItem) => item.equals(thisItem));
    if (!result) {
      throw new Error(`Could not find ${JSON.stringify(item)}`);
    }
    return result;
  }

  static isSubset<T extends Comparable<unknown>>(
    set: T[],
    superset: T[],
  ): boolean {
    return set.every((thisItem) => ComparableArray.hasItem(thisItem, superset));
  }

  static allMatch<T extends Comparable<unknown>>(
    set1: T[],
    set2: T[],
  ): boolean {
    return set1.length === set2.length && this.isSubset(set1, set2);
  }
}
