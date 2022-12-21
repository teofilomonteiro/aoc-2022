import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  extractData,
  moveArray,
  moveElementInArray,
  phase1,
  phase2,
  toPositions,
} from "./lib.ts";

const input = `1
2
-3
3
-2
0
4`;

Deno.test("moveElementInArray", () => {
  function testMoveElementInArray(times: number) {
    let result = [...original];
    for (let i = 0; i <= times; i++) {
      const element = original[i];

      result = moveElementInArray(element, result);
    }
    return result.map(([value]) => value);
  }

  const original = toPositions([1, 2, -3, 3, -2, 0, 4]);
  assertEquals(testMoveElementInArray(0), [2, 1, -3, 3, -2, 0, 4]);

  assertEquals(testMoveElementInArray(1), [1, -3, 2, 3, -2, 0, 4]);

  assertEquals(testMoveElementInArray(2), [1, 2, 3, -2, -3, 0, 4]);

  assertEquals(testMoveElementInArray(3), [1, 2, -2, -3, 0, 3, 4]);

  assertEquals(testMoveElementInArray(4), [1, 2, -3, 0, 3, 4, -2]);
  assertEquals(testMoveElementInArray(5), [1, 2, -3, 0, 3, 4, -2]);

  assertEquals(testMoveElementInArray(6), [1, 2, -3, 4, 0, 3, -2]);
});

Deno.test("moveArray", () => {
  assertEquals(moveArray([1, 2, -3, 3, -2, 0, 4]), [1, 2, -3, 4, 0, 3, -2]);
});

Deno.test("Phase 1", () => {
  assertEquals(phase1(input), 3);
});

Deno.test("Extract data", () => {
  assertEquals(extractData(input), [1, 2, -3, 3, -2, 0, 4]);
});

Deno.test("Phase 2", () => {
  assertEquals(phase2(input), 1623178306);
});
