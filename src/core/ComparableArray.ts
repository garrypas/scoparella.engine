import { IComparable } from "./IComparable";

export class ComparableArray {
    static hasItem(item: IComparable, set: IComparable[]): boolean {
        return set.findIndex(c => item.equals(c)) >= 0;
    }

    static findItem(item: IComparable, set: IComparable[]) {
        const result = set.find(c => item.equals(c));
        if(!result) {
            throw new Error(`Could not find ${JSON.stringify(item)}`);
        }
        return result;
    }

    static isSubset(set: IComparable[], superset: IComparable[]): boolean {
        return set.every(c1 => ComparableArray.hasItem(c1, superset));
    }

    static allMatch(set1: IComparable[], set2: IComparable[]): boolean {
        return set1.length === set2.length && this.isSubset(set1, set2);
    }
}