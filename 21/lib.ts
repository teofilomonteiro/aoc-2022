// type MonkeyOperation = {
//   operation: string;
//   var1: string | number;
//   var2: string | number;
// };

export type Monkeys = {
  [key: string]: number | string;
};

export type ResolvedMonkeys = {
  [key: string]: number;
};

export function extractData(input: string): Monkeys {
  return input.split("\n").reduce((acc, line) => {
    const [name, operationText] = line.split(": ");

    if (name === undefined || operationText === undefined) {
      throw new Error("Error parsing input");
    }

    if (operationText.match(/^\d+$/)) {
      acc[name] = Number(operationText);
    } else {
      acc[name] = operationText;
    }
    return acc;
  }, {} as Monkeys);
}

export function monkeysTreated(monkeys: Monkeys) {
  const { resolved, unresolved } = Object.keys(monkeys).reduce(
    (acc, key) => {
      const monkeyOperation = monkeys[key];
      if (typeof monkeyOperation === "number") {
        acc.resolved[key] = monkeyOperation.toString();
      } else {
        acc.unresolved[key] = monkeyOperation;
      }
      return acc;
    },
    { resolved: {}, unresolved: {} } as {
      resolved: { [key: string]: string };
      unresolved: { [key: string]: string };
    }
  );

  const result = {} as Monkeys;

  for (const monkeyName of Object.keys(unresolved)) {
    result[monkeyName] = unresolved[monkeyName];

    for (const name of Object.keys(resolved)) {
      const monkeyOperation = result[monkeyName] as string;

      if (monkeyOperation.includes(name)) {
        const operationResult = monkeyOperation.replace(name, resolved[name]);

        try {
          result[monkeyName] = eval(operationResult) as number;
          break;
        } catch {
          result[monkeyName] = operationResult;
        }
      }
    }
  }

  return result;
}

export function phase1(input: string) {
  let monkeys = extractData(input);

  while (!isNumber(monkeys["root"])) {
    monkeys = monkeysTreated(monkeys);
  }

  return monkeys["root"];
}

type InvertResult = {
  key: string;
  result: number;
};

const reverse = {
  "/": "*",
  "*": "/",
  "+": "-",
  "-": "+",
};

type ReverseOperation = typeof reverse;
type ReverseKey = keyof ReverseOperation;
const operations = Object.keys(reverse) as ReverseKey[];

const isReverseKeyOperation = (op: unknown): op is ReverseKey =>
  operations.includes(op as ReverseKey);

export function solveInOrderOf(func: string, equal: number): InvertResult {
  const [var1, op, var2] = func.split(" ");

  if (
    !isReverseKeyOperation(op) ||
    (!canConvertToNumber(var1) && !canConvertToNumber(var2))
  ) {
    throw new Error("Can't parse function");
  }
  if (canConvertToNumber(var1) && op === "-") {
    return { key: var2, result: eval(`${var1}-${equal}`) };
  }

  const key = canConvertToNumber(var1) ? var2 : var1;
  const value = canConvertToNumber(var1) ? var1 : var2;

  return { key, result: eval(`${equal} ${reverse[op]} ${value}`) };
}

export function phase2(input: string) {
  const data = extractData(input);

  const entryData: Monkeys = Object.fromEntries(
    Object.entries(data).filter(([key]) => !["root", "humn"].includes(key))
  );

  const waitKeys = (data["root"] as string).split(/ [+/*] /);

  let { solution, monkeys } = solve(entryData, waitKeys);

  let key = waitKeys.find((key) => key !== solution?.key) as string;

  if (solution === undefined) {
    throw new Error("Couldn't find a solution");
  }

  let result = solution.result;

  do {
    const func = monkeys[key];
    if (isNumber(func)) {
      throw new Error("AA");
    }

    ({ key, result } = solveInOrderOf(func, result));

    if (key === "humn") break;
  } while (true);

  return result;
}

const isNumber = (value: string | number): value is number =>
  typeof value === "number";

const canConvertToNumber = (value: string): boolean =>
  value.match(/^\d+$/) !== null;

function solve(monkeys: Monkeys, waitKeys: string[]) {
  let solution: InvertResult | undefined;

  do {
    monkeys = monkeysTreated(monkeys);

    if (waitKeys.some((name) => isNumber(monkeys[name]))) {
      solution = isResolved(waitKeys, monkeys);
    }
  } while (
    !Object.entries(monkeys)
      .filter(([key]) => !waitKeys.includes(key))
      .every(([_, value]) => !isNumber(value))
  );

  return { solution, monkeys };
}

function isResolved(
  waitKeys: string[],
  monkeys: Monkeys
): InvertResult | undefined {
  return waitKeys
    .map((key) => ({ key, result: monkeys[key] } as InvertResult))
    .find(({ result }) => isNumber(result));
}
