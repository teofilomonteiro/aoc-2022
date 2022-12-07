import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { phase1, phase2, unique } from "./lib.ts";

// mjqjpqmgbljsphdztnvjfqwrcgsmlb

Deno.test("Repeated", () => {
  assertEquals(unique("mjqj"), false);
  assertEquals(unique("jqjp"), false);
  assertEquals(unique("qjpq"), false);
  assertEquals(unique("jpqm"), true);
});

Deno.test("Phase 1", () => {
  // assertEquals(findUniqueSubSet("mjqjpqmgbljsphdztnvjfqwrcgsmlb"), 4);
  assertEquals(phase1("bvwbjplbgvbhsrlpgdmjqwftvncz"), 5);
  assertEquals(phase1("nppdvjthqldpwncqszvftbrmjlhg"), 6);
  assertEquals(phase1("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"), 10);
  assertEquals(phase1("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"), 11);
});

Deno.test("Phase 2", () => {
  // mjqjpqmgbljsphdztnvjfqwrcgsmlb: first marker after character 19
  assertEquals(phase2("bvwbjplbgvbhsrlpgdmjqwftvncz"), 23);
  assertEquals(phase2("nppdvjthqldpwncqszvftbrmjlhg"), 23);
  assertEquals(phase2("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"), 29);
  assertEquals(phase2("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"), 26);
});
