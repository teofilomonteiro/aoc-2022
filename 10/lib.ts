import { sum } from "../lib/index.ts";

// Define the type of the input
type OperationType = "noop" | "addx";

type NoopOperation = {
  operation: "noop";
};

type Operation =
  | NoopOperation
  | {
      operation: "addx";
      value: number;
    };

const opDurationTranslation = {
  noop: 1,
  addx: 2,
};

// Function to parse the input and return the operation and sum
export const parseOperation = (input: string): Operation => {
  const [operation, value] = input.split(" ");

  if (operation === "noop") {
    return {
      operation,
    };
  } else if (operation === "addx") {
    return {
      operation,
      value: Number(value),
    };
  }

  throw new Error("not a valid operation");
};

export function execute(stack: Operation[]) {
  let registry = 1;
  const history: number[] = [];

  let index = 0;
  let currentOp = stack[index];
  let opDuration = opDurationTranslation[currentOp.operation];

  do {
    if (opDuration === 0) {
      if (currentOp.operation === "addx") {
        registry += currentOp.value;
      }

      index++;

      if (index !== stack.length) {
        currentOp = stack[index];
        opDuration = opDurationTranslation[currentOp.operation];
      }
    }

    history.push(registry);
    opDuration--;
  } while (index !== stack.length);
  return history;
}

function printChar(registry: number, printPosition: number) {
  return printPosition >= registry && printPosition <= registry + 2 ? "#" : ".";
}

export function print(stack: Operation[]) {
  let registry = 0;
  let printerLine = 0;
  let printerCycle = 0;

  const printer: string[][] = [];
  printer[printerLine] = [];

  let index = 0;
  let currentOp = stack[index];
  let opDuration = opDurationTranslation[currentOp.operation];

  do {
    if (opDuration === 0) {
      if (currentOp.operation === "addx") {
        registry += currentOp.value;
      }

      index++;

      if (index !== stack.length) {
        currentOp = stack[index];
        opDuration = opDurationTranslation[currentOp.operation];
      }
    }
    if (index !== stack.length) {
      printer[printerLine].push(printChar(registry, printerCycle));
    }
    opDuration--;
    printerCycle++;
    if (printerCycle % 40 === 0) {
      printerLine++;
      printerCycle = 0;
      printer[printerLine] = [];
    }
  } while (index !== stack.length);
  return printer;
}
export function createOperationStack(input: string) {
  const lines = input.split("\n");
  return lines.map(parseOperation);
}

export function phase1(input: string) {
  const stack = createOperationStack(input);
  const history: number[] = execute(stack);

  const historyPos = [20, 60, 100, 140, 180, 220].map(
    (pos) => pos * history[pos - 1]
  );
  return sum(historyPos);
}

export function phase2(input: string) {
  const stack = createOperationStack(input);
  const history = print(stack);

  return history.map((l) => l.join("")).join("\n");
}
