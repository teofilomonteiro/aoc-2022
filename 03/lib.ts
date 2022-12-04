import { sum } from "../lib/index.ts";

export function getUniqueLetter(text: string) {
  const group1 = text.substring(0, text.length / 2).split("");
  const group2 = text.substring(text.length / 2);

  for (const letter of group1) {
    if (group2.indexOf(letter) >= 0) {
      return letter;
    }
  }

  throw new Error("Not found letter");
}

export function getPriority(letter: string) {
  if (/[a-z]/.test(letter)) {
    return letter.charCodeAt(0) - "a".charCodeAt(0) + 1;
  }
  return letter.charCodeAt(0) - "A".charCodeAt(0) + 27;
}

export function getTotalPriority(input: string) {
  return sum(
    input.split("\n").map((line) => getPriority(getUniqueLetter(line)))
  );
}

function findPriorityInThree(
  sourceLine: string,
  extraLine1: string,
  extraLine2: string
) {
  for (const letter of sourceLine.split("")) {
    if (extraLine1.indexOf(letter) >= 0 && extraLine2.indexOf(letter) >= 0) {
      return getPriority(letter);
    }
  }
  throw new Error("Not found commun letter");
}

export function getPriorityOfThree(input: string) {
  const lines = input.split("\n");
  let sum = 0;
  for (let i = 0; i < lines.length; i = i + 3) {
    sum += findPriorityInThree(lines[i], lines[i + 1], lines[i + 2]);
  }
  return sum;
}
