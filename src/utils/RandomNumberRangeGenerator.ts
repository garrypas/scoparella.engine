export class RandomNumberRangeGenerator {
  static generateRange(scale: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < scale; i++) {
      result.push(i);
    }
    result.sort(() => (Math.random() > 0.5 ? 1 : -1));
    return result;
  }
}
