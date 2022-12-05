import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { phase1, phase2 } from "./lib.ts";

Deno.test("Phase 1", () => {
  const input = `1234`;
  assertEquals(phase1(input), "");
});

Deno.test("Phase 2", () => {
  const input = `1234`;
  assertEquals(phase2(input), "");
});
