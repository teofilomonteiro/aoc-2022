import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { phase1, phase2 } from "./lib.ts";

const input = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`;

Deno.test("Phase 1", () => {
  assertEquals(phase1(input), 3068);
});

Deno.test("Phase 2", () => {
  assertEquals(phase2(input), 1514285714288);
});
