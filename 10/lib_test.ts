import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  createOperationStack,
  execute,
  parseOperation,
  phase1,
  phase2,
  print,
} from "./lib.ts";

const inputTest1 = `noop
addx 3
addx -5`;
const inputTest2 = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

Deno.test("Parse Operation", () => {
  assertEquals(parseOperation("noop"), { operation: "noop" });
  assertEquals(parseOperation("addx 3"), { operation: "addx", value: 3 });
  assertEquals(parseOperation("addx -5"), { operation: "addx", value: -5 });
});

Deno.test("createOperationStack", () => {
  assertEquals(createOperationStack(inputTest1), [
    { operation: "noop" },
    { operation: "addx", value: 3 },
    { operation: "addx", value: -5 },
  ]);
});

Deno.test("createOperationStack", () => {
  const stack = createOperationStack(inputTest1);
  const history: number[] = execute(stack);

  assertEquals(history, [1, 1, 1, 4, 4, -1]);
});

Deno.test("createOperationStack v1", () => {
  const stack = createOperationStack(inputTest2);
  const history: number[] = execute(stack);

  assertEquals(history[19], 21);
  assertEquals(history[59], 19);
  assertEquals(history[99], 18);
  assertEquals(history[139], 21);
  assertEquals(history[179], 16);
  assertEquals(history[219], 18);
});

Deno.test("Phase 1", () => {
  assertEquals(phase1(inputTest2), 13140);
});

Deno.test("Sprite moving", () => {
  const stack = createOperationStack(inputTest2);
  const history = print(stack);
  assertEquals(
    history.map((l) => l.join("")).join("\n"),
    `##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....
`
  );
});

Deno.test("Phase 2", () => {
  assertEquals(
    phase2(inputTest2),
    `##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....
`
  );
});
