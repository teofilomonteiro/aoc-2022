import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { phase1, phase2 } from "./lib.ts";

const input = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

Deno.test("Phase 1", () => {
  assertEquals(phase1(input), 24);
});

Deno.test("Phase 2", () => {
  assertEquals(phase2(input), 93);
});
