import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { extractData, phase1, phase2, sumSides } from "./lib.ts";

const smallExample = `1,1,1
2,1,1`;

const input = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

Deno.test("Sides", () => {
  assertEquals(
    sumSides([
      [1, 1, 1],
      [2, 1, 1],
    ]),
    10
  );
});

Deno.test("Extract data", () => {
  assertEquals(extractData(smallExample), [
    [1, 1, 1],
    [2, 1, 1],
  ]);
});

Deno.test("Phase 1", () => {
  assertEquals(phase1(smallExample), 10);
  assertEquals(phase1(input), 64);
});

Deno.test("Phase 2", () => {
  assertEquals(phase1(smallExample), 10);
  assertEquals(phase2(input), 58);
});
