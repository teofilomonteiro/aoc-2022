import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Board,
  countInsideVisible,
  countEdges,
  isVisible,
  phase1,
  phase2,
  readBoard,
  visibleCount,
} from "./lib.ts";

const input = `30373
25512
65332
33549
35390`;

Deno.test("Detect edges", () => {
  const board: Board = readBoard(input);
  assertEquals(countEdges(board), 16);
});

Deno.test("Is visible", () => {
  const board: Board = readBoard(input);
  assertEquals(isVisible(1, 1, board), true);
  assertEquals(isVisible(1, 2, board), true);
  assertEquals(isVisible(1, 3, board), false);
  assertEquals(isVisible(2, 1, board), true);
  assertEquals(isVisible(2, 2, board), false);
  assertEquals(isVisible(2, 3, board), true);
  // assertEquals(isVisible(3, 3, board), false);
});

Deno.test("Count visible", () => {
  const board: Board = readBoard(input);
  assertEquals(countInsideVisible(board), 5);
});

Deno.test("Phase 1", () => {
  assertEquals(phase1(input), 21);
});

Deno.test("count", () => {
  const board: Board = readBoard(input);
  // assertEquals(visibleCount(board, 1, 2), 4);
  assertEquals(visibleCount(board, 3, 2), 8);
});

Deno.test("Phase 2", () => {
  assertEquals(phase2(input), 8);
});
