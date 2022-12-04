import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { getPriority, getPriorityOfThree, getUniqueLetter } from "./lib.ts";

Deno.test("Split line 1", () => {
  const line = "vJrwpWtwJgWrhcsFMMfFFhFp";

  assertEquals(getUniqueLetter(line), "p");
});

Deno.test("Split line 2", () => {
  const line = "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL";

  assertEquals(getUniqueLetter(line), "L");
});

Deno.test("Get priority Value", () => {
  assertEquals(getPriority("p"), 16);
  assertEquals(getPriority("L"), 38);
  assertEquals(getPriority("P"), 42);
  assertEquals(getPriority("v"), 22);
  assertEquals(getPriority("t"), 20);
  assertEquals(getPriority("s"), 19);
});

Deno.test("Calculate results simple", () => {
  const input = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;
  assertEquals(getPriorityOfThree(input), 70);
});
