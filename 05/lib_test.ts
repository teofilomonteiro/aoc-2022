import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  phase1,
  phase2,
  getContainers,
  parseInstructions,
  moveContainers,
} from "./lib.ts";

Deno.test("Parse puzzle", () => {
  const input = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3`;
  assertEquals(getContainers(input), [["Z", "N"], ["M", "C", "D"], ["P"]]);
});

Deno.test("Parse instructions", () => {
  assertEquals(parseInstructions("move 1 from 2 to 1"), {
    move: 1,
    from: 2,
    to: 1,
  });
  assertEquals(parseInstructions("move 3 from 1 to 3"), {
    move: 3,
    from: 1,
    to: 3,
  });
});

Deno.test("move instructions", () => {
  const containers = [["Z", "N"], ["M", "C", "D"], ["P"]];
  const instruction = {
    move: 1,
    from: 2,
    to: 1,
  };
  assertEquals(moveContainers(containers, instruction), [
    ["Z", "N", "D"],
    ["M", "C"],
    ["P"],
  ]);

  assertEquals(
    moveContainers([["Z", "N", "D"], ["M", "C"], ["P"]], {
      move: 3,
      from: 1,
      to: 3,
    }),
    [[], ["M", "C"], ["P", "D", "N", "Z"]]
  );
});

Deno.test("Phase 1", () => {
  const containers = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3`;

  const instruction = `move 1 from 2 to 1
 move 3 from 1 to 3
 move 2 from 2 to 1
 move 1 from 1 to 2`;

  assertEquals(phase1(getContainers(containers), instruction), "CMZ");
});

Deno.test("Phase 2", () => {
  const containers = `    [D]    
  [N] [C]    
  [Z] [M] [P]
   1   2   3`;

  const instruction = `move 1 from 2 to 1
   move 3 from 1 to 3
   move 2 from 2 to 1
   move 1 from 1 to 2`;

  assertEquals(phase2(getContainers(containers), instruction), "MCD");
});
