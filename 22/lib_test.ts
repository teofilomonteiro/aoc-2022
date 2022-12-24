import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  buildEdges,
  calcNextMovement,
  nextPositionInFlatEarth,
  extractData,
  findStart,
  moveInMap,
  phase1,
  walkFlatEarth,
} from "./lib.ts";

const input = `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

Deno.test("Extract data", () => {
  const { map, directions } = extractData(input);
  assertEquals(map[0], ["", "", "", "", "", "", "", "", ".", ".", ".", "#"]);
  assertEquals(directions, ["R10", "R5", "L5", "R10", "L4", "R5", "L5"]);
});

Deno.test("findBegining", () => {
  const { map } = extractData(input);
  assertEquals(findStart(map), { row: 0, collumn: 8 });
});

Deno.test("Edges", () => {
  const { map } = extractData(input);
  const edges = buildEdges(map);

  const { row, collumn } = edges;
  // ROW
  assertEquals(row[0], { start: 8, end: 11 });
  assertEquals(row[5], { start: 0, end: 11 });
  assertEquals(row[10], { start: 8, end: 15 });
  // collumn
  assertEquals(collumn[0], { start: 4, end: 7 });
  assertEquals(collumn[9], { start: 0, end: 11 });
  assertEquals(collumn[15], { start: 8, end: 11 });
});

Deno.test("calcNextPosition", () => {
  const edgesMap = {
    row: [{ start: 0, end: 10 }],
    collumn: [{ start: 0, end: 5 }],
  };

  // row
  assertEquals(
    nextPositionInFlatEarth({ row: 0, collumn: 0 }, 1, "row", edgesMap),
    {
      row: 0,
      collumn: 1,
    }
  );

  // last position of row
  assertEquals(
    nextPositionInFlatEarth({ row: 0, collumn: 10 }, 1, "row", edgesMap),
    {
      row: 0,
      collumn: 0,
    }
  );

  // going backwards
  assertEquals(
    nextPositionInFlatEarth({ row: 0, collumn: 0 }, -1, "row", edgesMap),
    {
      row: 0,
      collumn: 10,
    }
  );

  // row
  assertEquals(
    nextPositionInFlatEarth({ row: 0, collumn: 0 }, 1, "collumn", edgesMap),
    {
      row: 1,
      collumn: 0,
    }
  );

  // last position of row
  assertEquals(
    nextPositionInFlatEarth({ row: 5, collumn: 0 }, 1, "collumn", edgesMap),
    {
      row: 0,
      collumn: 0,
    }
  );

  // going backwards
  assertEquals(
    nextPositionInFlatEarth({ row: 0, collumn: 0 }, -1, "collumn", edgesMap),
    {
      row: 5,
      collumn: 0,
    }
  );
});

Deno.test("Move in Map", () => {
  const { map } = extractData(input);
  const edgesMap = buildEdges(map);

  assertEquals(
    moveInMap(
      { row: 0, collumn: 8 },
      { direction: "right", nrOfSteps: 10 },
      map,
      (direction, currentPostion) =>
        walkFlatEarth(direction, currentPostion, edgesMap)
    ),
    { row: 0, collumn: 10 }
  );

  assertEquals(
    moveInMap(
      { row: 0, collumn: 10 },
      { direction: "down", nrOfSteps: 5 },
      map,
      (direction, currentPostion) =>
        walkFlatEarth(direction, currentPostion, edgesMap)
    ),
    { row: 5, collumn: 10 }
  );
});

Deno.test("calcNextMovent", () => {
  assertEquals(calcNextMovement("R10", "up"), {
    direction: "right",
    nrOfSteps: 10,
  });

  assertEquals(calcNextMovement("R100", "right"), {
    direction: "down",
    nrOfSteps: 100,
  });

  assertEquals(calcNextMovement("R1", "down"), {
    direction: "left",
    nrOfSteps: 1,
  });

  assertEquals(calcNextMovement("L20", "up"), {
    direction: "left",
    nrOfSteps: 20,
  });

  assertEquals(calcNextMovement("R20", "left"), {
    direction: "up",
    nrOfSteps: 20,
  });
});

Deno.test("Phase 1", () => {
  assertEquals(phase1(input), 6032);
});
