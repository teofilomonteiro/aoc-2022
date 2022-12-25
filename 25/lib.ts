import { sum } from "../lib/index.ts";

type Data = string[];

export function extractData(input: string): Data {
  return input.split("\n");
}

export function fromSNAFU(snafu: string): number {
  let result = 0;

  snafu
    .split("")
    .reverse()
    .forEach((digit, index) => {
      const currentLevel = 5 ** index;

      if (digit !== "-" && digit !== "=") {
        result += Number(digit) * currentLevel;
      } else {
        result += (digit === "-" ? -1 : -2) * currentLevel;
      }
    });
  return result;
}

export function toSNAFU(n: number): string {
  let rest = 0;
  const transformed = n.toString(5).split("").reverse().map(Number);

  const snafu: number[] = [];
  for (const digit of transformed) {
    if (digit + rest <= 2) {
      snafu.push(digit + rest);
      rest = 0;
    } else {
      snafu.push(digit + rest - 5);
      rest = 1;
    }
  }

  if (rest > 0) {
    snafu.push(rest);
  }

  return snafu
    .reverse()
    .map((x) => {
      if (x === -2) {
        return "=";
      } else if (x === -1) {
        return "-";
      }
      return x.toString();
    })
    .join("");
}

export function phase1(input: string) {
  const data = extractData(input);
  const result = sum(data.map(fromSNAFU));
  return toSNAFU(result);
}
export function phase2(input: string) {
  const data = extractData(input);
  return "";
}
