//2-4,6-8

function fromRange(range: string): [number, number] {
  return range.split("-").map((n) => Number(n)) as [number, number];
}

export function contains(range1: string, range2: string) {
  const [a1, a2] = fromRange(range1);
  const [b1, b2] = fromRange(range2);

  return (a1 >= b1 && a2 <= b2) || (b1 >= a1 && b2 <= a2);
}

export function overlaps(range: string) {
  const [range1, range2] = range.split(",") as [string, string];
  const [a1, a2] = fromRange(range1);
  const [b1, b2] = fromRange(range2);

  return (
    a1 === b1 ||
    a1 === b2 ||
    a2 === b1 ||
    a2 === b2 ||
    (a1 > b1 && a2 < b2) ||
    (b1 > a1 && b2 < a2) ||
    (b1 > a1 && b1 < a2) ||
    (a1 > b1 && a1 < b2)
  );
}

export function phase1(input: string) {
  const lines = input.split("\n");
  return lines
    .map((line) => {
      const [range1, range2] = line.split(",") as [string, string];
      return contains(range1, range2);
    })
    .filter(Boolean).length;
}
export function phase2(input: string) {
  const ranges = input.split("\n");
  return ranges.map(overlaps).filter(Boolean).length;
}
