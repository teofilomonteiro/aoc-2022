import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { calcMaxBuild, extractData, phase1, phase2 } from "./lib.ts";
import type { Blueprint } from "./lib.ts";

const input = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`;

const blueprint1: Blueprint = [4, 2, 3, 14, 2, 7];

const blueprint2: Blueprint = [2, 3, 3, 8, 3, 12];

Deno.test("Extract data", () => {
  assertEquals(extractData(input), [blueprint1, blueprint2]);
});

Deno.test("Calculate path ", () => {
  const blueprints = extractData(
    "Blueprint 13: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 11 clay. Each geode robot costs 4 ore and 8 obsidian."
  );

  assertEquals(calcMaxBuild(blueprints[0], 24), 3);
  assertEquals(calcMaxBuild(blueprint1, 24), 9);
  assertEquals(calcMaxBuild(blueprint2, 24), 12);
});

Deno.test("Phase 1", () => {
  assertEquals(phase1(input), 33);
});

// Deno.test("Phase 2", () => {
//   assertEquals(phase2(input), 3472);
// });
