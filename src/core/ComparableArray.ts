import { Comparable } from "./Comparable";

export class ComparableArray {
    static hasItem(item: Comparable, set: Comparable[]): boolean {
        return set.findIndex(c => item.equals(c)) >= 0;
    }

    static findItem(item: Comparable, set: Comparable[]) {
        const result = set.find(c => item.equals(c));
        if(!result) {
            throw new Error(`Could not find ${JSON.stringify(item)}`);
        }
        return result;
    }

    static isSubset(set: Comparable[], superset: Comparable[]): boolean {
        return set.every(c1 => ComparableArray.hasItem(c1, superset));
    }

    static allMatch(set1: Comparable[], set2: Comparable[]): boolean {
        return set1.length === set2.length && this.isSubset(set1, set2);
    }
}