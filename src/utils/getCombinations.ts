export function getCombinations<TElement>(arr: TElement[]): TElement[][] {
  const result: TElement[][] = [];
  for (let i = 1; i <= arr.length; i++) {
    combinationsAV2(arr.length, i).forEach((a: number[]) =>
      result.push(a.map((n: number) => arr[n - 1])),
    );
  }
  return result;
}

function combinationsAV2(n: number, k: number): number[][] {
  const result: number[][] = [];
  const combos: number[] = [];
  const recurse = (start: number) => {
    if (combos.length + (n - start + 1) < k) {
      return;
    }
    recurse(start + 1);
    combos.push(start);
    if (combos.length === k) {
      result.push(combos.slice());
    } else if (combos.length + (n - start + 2) >= k) {
      recurse(start + 1);
    }
    combos.pop();
  };
  recurse(1);
  return result;
}
