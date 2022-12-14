import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { compare, parseInput, phase1, phase2 } from "./lib.ts";

const input = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

Deno.test("compare arrays => only numbers", () => {
  assertEquals(compare([1, 1, 3, 1, 1], [1, 1, 5, 1, 1]), "right"); // correct
});

Deno.test("compare arrays => arrays of arrays", () => {
  assertEquals(compare([[1], [2, 3, 4]], [[1], 4]), "right"); // correct
});

Deno.test("compare arrays => arrays of arrays with less ", () => {
  assertEquals(compare([9], [[8, 7, 6]]), "wrong"); // correct
});

Deno.test("compare arrays => should be equal", () => {
  assertEquals(compare([[4, 4], 4, 4], [[4, 4], 4, 4, 4]), "right");
});

Deno.test("compare arrays => same integer", () => {
  assertEquals(compare([7, 7, 7, 7], [7, 7, 7]), "wrong");
});

Deno.test("compare arrays => empty array vs array ", () => {
  assertEquals(compare([], [3]), "right");
});

Deno.test("compare arrays => empty arrays", () => {
  assertEquals(compare([[[]]], [[]]), "wrong");
});

Deno.test("compare arrays => complex arrays", () => {
  assertEquals(
    compare(
      [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
      [1, [2, [3, [4, [5, 6, 0]]]], 8, 9]
    ),
    "wrong"
  );
});

Deno.test("compare arrays => complex arrays x3", () => {
  assertEquals(
    compare(
      [
        [
          [[0, 7], 10],
          [
            [1, 10, 4],
            [2, 9, 2],
            [9, 9, 3, 6],
          ],
          5,
          4,
          6,
        ],
        [[7], 9],
        [[], [], [[0]], 2],
      ],
      [
        [
          [[], 5, 10, 3],
          [0, 7, 2, 1, [9, 1]],
        ],
        [],
        [
          [[8, 5]],
          [
            [1, 5, 1, 7, 2],
            [8, 6, 1, 7, 9],
          ],
          2,
          7,
        ],
        [],
      ]
    ),
    "wrong"
  );
});

Deno.test("compare arrays => empty arrays continue", () => {
  assertEquals(
    compare(
      [
        [],
        [
          [
            [10, 2, 6],
            [1, 4, 9, 2, 5],
          ],
          [],
          [5, 2],
          [1, 3, 5],
        ],
        [
          [[7, 2, 2, 0], [0, 1], 10],
          10,
          [9, [4, 8], [8, 2, 10], [1, 4, 2]],
          7,
          [[2]],
        ],
      ],
      [
        [],
        [[[], [], [9, 10, 5, 6], 2, [0]], 10],
        [[], [[4, 9, 3, 7], 7, 4], [], 2, 2],
        [
          8,
          [6, 8, [7, 5, 5], [2, 4, 8, 0, 7], [3, 1, 7, 3, 9]],
          [[9, 1, 5, 1], [5, 1, 1], [], [2, 1, 2, 1]],
          [[0, 9, 1, 10], 5, [], 10, [5, 0, 10, 2]],
          [10, [3, 4, 8, 8, 4], 5],
        ],
      ]
    ),
    "wrong"
  );
});

Deno.test("compare arrays => empty arrays", () => {
  assertEquals(
    parseInput(`[1,1,3,1,1]
  [1,1,5,1,1]
  `),
    [
      [
        [1, 1, 3, 1, 1],
        [1, 1, 5, 1, 1],
      ],
    ]
  );
});
Deno.test("Phase 1", () => {
  assertEquals(phase1(input), 13);
});

Deno.test("Phase 2", () => {
  assertEquals(phase2(input), 140);
});
