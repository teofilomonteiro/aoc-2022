import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { eulerDistance, movePieceT, phase1, phase2 } from "./lib.ts";

Deno.test("Euler distance", () => {
  assertEquals(eulerDistance([0, 0], [0, 1]) < 2, true);
  assertEquals(eulerDistance([1, 1], [0, 0]) < 2, true);
  assertEquals(eulerDistance([0, 1], [0, 3]) < 2, false);
});

Deno.test("Move Piece T", () => {
  assertEquals(movePieceT([0, 0], [0, 1], "D"), [0, 1]);
  assertEquals(movePieceT([3, 0], [1, 0], "R"), [2, 0]);
  assertEquals(movePieceT([3, 1], [2, 0], "R"), [2, 0]);
  assertEquals(movePieceT([3, 2], [2, 0], "R"), [3, 1]);
});

const input = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;
Deno.test("Phase 1", () => {
  assertEquals(phase1(input), 13);
});

Deno.test("Phase 2", () => {
  assertEquals(
    phase2(`R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`),
    36
  );
});
