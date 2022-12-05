import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { contains, overlaps, phase1, phase2 } from "./lib.ts";

Deno.test("Contains", () => {
  assertEquals(contains("2-4", "6-8"), false);
  assertEquals(contains("2-3", "4-5"), false);
  assertEquals(contains("5-7", "7-9"), false);
  assertEquals(contains("2-8", "3-7"), true);
  assertEquals(contains("6-6", "4-6"), true);
  assertEquals(contains("2-6", "4-8"), false);
});

Deno.test("Overlaps", async (t) => {
  await t.step("no overlap", () => {
    assertEquals(overlaps("2-4,6-8"), false);
    assertEquals(overlaps("2-3,4-5"), false);
  });

  await t.step("border overlap", () => {
    assertEquals(overlaps("5-7,7-9"), true);
    assertEquals(overlaps("6-6,4-6"), true);
  });

  await t.step("inside overlap", () => {
    assertEquals(overlaps("2-8,3-7"), true);
  });

  await t.step("range overlap", () => {
    assertEquals(overlaps("2-6,4-8"), true);
    assertEquals(overlaps("4-6,2-5"), true);
  });
});

Deno.test("Phase 1", () => {
  const input = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;
  assertEquals(phase1(input), 2);
});

Deno.test("Phase 2", () => {
  const input = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;
  assertEquals(phase2(input), 4);
});
