import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { extractData, phase1, phase2 } from "./lib.ts";

const input = `1234`;

Deno.test("Extract data", () => {
  assertEquals(extractData(input), ["1234"]);
});

Deno.test("Phase 1", () => {
  assertEquals(phase1(input), "");
});

Deno.test("Phase 2", () => {
  assertEquals(phase2(input), "");
});
