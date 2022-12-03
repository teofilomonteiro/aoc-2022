import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { calculateResults1, calculateResults2 } from "./lib.ts";

Deno.test("Calculate results simple", () => {
  const input = `A Y
B X
C Z`;
  assertEquals(calculateResults1(input), 15);
});

Deno.test("Calculate results more complex", () => {
  const input = `A Y
B X
C Z`;
  assertEquals(calculateResults2(input), 12);
});
