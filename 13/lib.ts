import { multiply, sum } from "../lib/index.ts";

type ArrayNumber = number | ArrayNumber[];
type Result = "same" | "right" | "wrong";

const isNumber = (elem: ArrayNumber) => typeof elem === "number";
const transformToArray = (elem: ArrayNumber) =>
  typeof elem === "number" ? [elem] : elem;

export function compare(left: ArrayNumber[], right: ArrayNumber[]): Result {
  let result: Result = "same";
  const tmpLeft = [...left];
  const tmpRight = [...right];

  do {
    const leftElem = tmpLeft.shift();
    const rightElem = tmpRight.shift();

    if (leftElem !== undefined && rightElem !== undefined) {
      if (isNumber(leftElem) && isNumber(rightElem)) {
        result =
          leftElem === rightElem
            ? "same"
            : leftElem < rightElem
            ? "right"
            : "wrong";
      } else {
        result = compare(
          transformToArray(leftElem),
          transformToArray(rightElem)
        );
      }
    } else if (leftElem === rightElem) {
      result = "same";
    } else {
      result = leftElem === undefined ? "right" : "wrong";
    }
  } while (result === "same" && tmpLeft.length !== 0 && tmpRight.length !== 0);

  if (result !== "same") {
    return result;
  }

  return tmpLeft.length !== tmpRight.length
    ? compare([tmpLeft.length], [tmpRight.length])
    : result;
}

export function parseInput(input: string) {
  return input
    .split(/^\s*$/gm)
    .filter(Boolean)
    .map(
      (pair) =>
        pair
          .split("\n")
          .filter(Boolean)
          .map((p) => JSON.parse(p)) as [ArrayNumber[], ArrayNumber[]]
    );
}

export function phase1(input: string) {
  let pairs = parseInput(input);

  const results = [...pairs].map(([p1, p2], index) =>
    compare(p1, p2) !== "wrong" ? index + 1 : 0
  );

  return sum(results);
}

function toBoolean(result: Result): number {
  if (result === "right") {
    return -1;
  } else if (result === "wrong") {
    return 1;
  }
  return 0;
}

export function phase2(input: string) {
  const pairs = parseInput(input);
  const dividers: ArrayNumber[] = [[[2]], [[6]]];

  const results = ([...pairs.flat(), ...dividers] as ArrayNumber[][])
    .sort(
      (left, right) =>
        toBoolean(compare(left, right)) - toBoolean(compare(right, left))
    )
    .map((v, index) => (dividers.includes(v) ? index + 1 : 1));

  return multiply(results);
}
