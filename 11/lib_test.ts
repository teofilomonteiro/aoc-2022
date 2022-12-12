import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  doOperation,
  phase1,
  phase2,
  simulateRoundV1,
  simulateRoundsV1,
  transformToMonkey,
  simulateRoundsV2,
  parseOperation,
} from "./lib.ts";

const input = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

Deno.test("Parse moneys", () => {
  assertEquals(transformToMonkey(input), [
    {
      number: 0,
      items: [79, 98],
      operation: {
        operator: "*",
        op2: 19,
      },
      test: {
        divisible: 23,
        ok: 2,
        nok: 3,
      },
    },
    {
      items: [54, 65, 75, 74],
      number: 1,
      operation: {
        operator: "+",
        op2: 6,
      },
      test: {
        divisible: 19,
        nok: 0,
        ok: 2,
      },
    },
    {
      items: [79, 60, 97],
      number: 2,
      operation: {
        operator: "*",
        op2: "old",
      },
      test: {
        divisible: 13,
        nok: 3,
        ok: 1,
      },
    },
    {
      items: [74],
      number: 3,
      operation: {
        operator: "+",
        op2: 3,
      },
      test: {
        divisible: 17,
        nok: 1,
        ok: 0,
      },
    },
  ]);
});

Deno.test("Opration math", () => {
  assertEquals(doOperation(parseOperation("Operation: new = old + 3"), 74), 77);
  assertEquals(
    doOperation(parseOperation("Operation: new = old * old"), 79),
    6241
  );
  assertEquals(
    doOperation(parseOperation("Operation: new = old * 19"), 79),
    1501
  );
});

Deno.test("Simulate round v1", () => {
  const monkeys = transformToMonkey(input);
  let history = simulateRoundV1(monkeys);

  assertEquals(
    monkeys.map((x) => x.items),
    [[20, 23, 27, 26], [2080, 25, 167, 207, 401, 1046], [], []]
  );
  assertEquals(history, [2, 4, 3, 5]);

  history = simulateRoundV1(monkeys);
  assertEquals(
    monkeys.map((x) => x.items),
    [[695, 10, 71, 135, 350], [43, 49, 58, 55, 362], [], []]
  );
  assertEquals(history, [4, 6, 1, 5]);
});

Deno.test("Simulate rounds v1", () => {
  const monkeys = transformToMonkey(input);
  const history = simulateRoundsV1(monkeys, 20);

  assertEquals(
    monkeys.map((x) => x.items),
    [[10, 12, 14, 26, 34], [245, 93, 53, 199, 115], [], []]
  );

  assertEquals(history, [101, 95, 7, 105]);
});

Deno.test("Phase 1", () => {
  assertEquals(phase1(input), 10605);
});

Deno.test("Simulate rounds v2  => 1", () => {
  const monkeys = transformToMonkey(input);
  const history = simulateRoundsV2(monkeys, 1);

  assertEquals(history, [2, 4, 3, 6]);
});

Deno.test("Simulate rounds v2  => 20", () => {
  const monkeys = transformToMonkey(input);
  const history = simulateRoundsV2(monkeys, 20);

  assertEquals(history, [99, 97, 8, 103]);
});

Deno.test("Simulate rounds v2  => 1000", () => {
  const monkeys = transformToMonkey(input);
  const history = simulateRoundsV2(monkeys, 1000);

  assertEquals(history, [5204, 4792, 199, 5192]);
});

Deno.test("Simulate rounds v2  => 10_000", () => {
  const monkeys = transformToMonkey(input);
  const history = simulateRoundsV2(monkeys, 1000);

  assertEquals(history, [5204, 4792, 199, 5192]);
});

Deno.test("Phase 2", () => {
  assertEquals(phase2(input), 2713310158);
});
