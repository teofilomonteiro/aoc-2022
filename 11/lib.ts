import { multiply } from "../lib/index.ts";

type Operation = {
  operator: string;
  op2: number | "old";
};

// Monkey 0:
//   Starting items: 79, 98
//   Operation: new = old * 19
//   Test: divisible by 23
//     If true: throw to monkey 2
//     If false: throw to monkey 3

type Monkey = {
  number: number;
  items: number[];
  operation: Operation;
  test: {
    divisible: number;
    ok: number;
    nok: number;
  };
};
type MonkeyV2 = {
  factorItems: bigint[];
} & Omit<Monkey, "items">;

export function transformToMonkey(monkeyText: string): Monkey[] {
  return monkeyText.split(/^\s*$/gm).map((lines) => {
    const monekyNumber = parseMonkeyNr(lines);
    const items = parseItems(lines);
    const operation = parseOperation(lines);
    const test = parseTest(lines);

    return {
      number: monekyNumber,
      items,
      operation,
      test,
    };
  });
}

// Examples of operations
// old * 19
// old * old
// old + 7
export function doOperation({ operator, op2 }: Operation, input: number) {
  let op;

  if (typeof op2 === "number") {
    op = op2;
  } else {
    op = input;
  }

  if (operator === "*") {
    return input * op;
  } else {
    return input + op;
  }
}

// Examples of operations
// old * 19
// old * old
// old + 7
export function doOperationV2({ operator, op2 }: Operation, input: bigint) {
  let op: bigint;

  if (typeof op2 === "number") {
    op = BigInt(op2);
  } else {
    op = input;
  }

  if (operator === "*") {
    return input * op;
  } else {
    return input + op;
  }
}

function parseTest(lines: string) {
  const testDiv = lines.match(/Test: divisible by (\d+)/);
  const ifTrue = lines.match(/If true: throw to monkey (\d+)/);
  const ifFalse = lines.match(/If false: throw to monkey (\d+)/);
  if (!testDiv || !ifTrue || !ifFalse) {
    throw new Error("Monkey test should be available");
  }

  return {
    divisible: Number(testDiv[1]),
    ok: Number(ifTrue[1]),
    nok: Number(ifFalse[1]),
  };
}

export function parseOperation(lines: string): Operation {
  const operation = lines.match(/Operation: new = (.+)/);
  if (!operation) {
    throw new Error("Monkey operation should be available");
  }

  const [op1, operator, toParseOp2] = operation[1].split(" ");

  if (op1 !== "old") {
    throw new Error("Operator 1 should be old");
  }

  let op2: number | "old";

  if (toParseOp2.match(/\d+/)) {
    op2 = Number(toParseOp2);
  } else if (toParseOp2 === "old") {
    op2 = "old";
  } else {
    throw new Error("Can't parse second operator");
  }

  if (operator === "*" || operator === "+") {
    return { operator, op2 };
  }

  throw new Error("We don't support the operation");
}

function parseItems(lines: string) {
  const items = lines.match(/Starting items: (.+)/);
  if (!items) {
    throw new Error("Monkey items should be available");
  }

  return items[1].split(", ").map(Number);
}

function parseMonkeyNr(lines: string) {
  const nrOfMonkey = lines.match(/Monkey (\d+)/);
  if (!nrOfMonkey || !nrOfMonkey[1]) {
    throw new Error("Monkey number should be available");
  }

  return Number(nrOfMonkey[1]);
}

export function simulateRoundsV1(monkeys: Monkey[], nrOfRounds: number) {
  let history: number[] = simulateRoundV1(monkeys);

  for (let roundNumber = 1; roundNumber < nrOfRounds; roundNumber++) {
    const addHistory = simulateRoundV1(monkeys);
    history = history.map((value, ind) => value + addHistory[ind]);
  }

  return history;
}

export function simulateRoundV1(monkeys: Monkey[]) {
  const history: number[] = [];
  for (const monkey of monkeys) {
    for (const stressLvl of monkey.items) {
      let result = doOperation(monkey.operation, stressLvl);
      result = Math.floor(result / 3);

      const { divisible, ok, nok } = monkey.test;

      monkeys[result % divisible === 0 ? ok : nok].items.push(result);
    }

    history.push(monkey.items.length);
    monkey.items = [];
  }
  return history;
}

export function toMonkeyV2(monkeys: Monkey[]): MonkeyV2[] {
  return monkeys.map((monkey) => {
    return {
      ...monkey,
      factorItems: monkey.items.map((x) => BigInt(x)),
    };
  });
}

export function simulateRoundsV2(monkeys: Monkey[], nrOfRounds: number) {
  const modulo = multiply(monkeys.map((x) => x.test.divisible));
  let history: number[] = simulateRoundV2(monkeys, modulo);

  for (let roundNumber = 1; roundNumber < nrOfRounds; roundNumber++) {
    const addHistory = simulateRoundV2(monkeys, modulo);
    history = history.map((value, ind) => value + addHistory[ind]);
  }

  return history;
}

export function simulateRoundV2(monkeys: Monkey[], modulo: number) {
  const history: number[] = [];
  for (const monkey of monkeys) {
    for (const stressLvl of monkey.items) {
      let worryLevel = doOperation(monkey.operation, stressLvl);
      worryLevel %= modulo;
      const { divisible, ok, nok } = monkey.test;
      monkeys[worryLevel % divisible === 0 ? ok : nok].items.push(worryLevel);
    }

    history.push(monkey.items.length);
    monkey.items = [];
  }

  return history;
}

function findIndicesOfMax(inp: number[], count: number) {
  const sorted = inp.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
  return sorted.slice(0, count);
}

export function phase1(input: string) {
  const monkeys = transformToMonkey(input);

  const history = simulateRoundsV1(monkeys, 20);
  const [o1, o2] = findIndicesOfMax(history, 2);
  return o1 * o2;
}

export function phase2(input: string) {
  const monkeys = transformToMonkey(input);

  const history = simulateRoundsV2(monkeys, 10_000);
  const [o1, o2] = findIndicesOfMax(history, 2);
  return o1 * o2;
}
