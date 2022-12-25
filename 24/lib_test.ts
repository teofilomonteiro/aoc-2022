import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  blizzardMove,
  extractData,
  phase1,
  phase2,
  calcCurrentMap,
} from "./lib.ts";

const simpleInput = `#.#####
#.....#
#.>...#
#.....#
#.....#
#...v.#
#####.#`;

const complexInput = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`;

Deno.test("Bizzard data", () => {
  const { blizzard } = extractData(simpleInput);
  assertEquals(blizzard, [
    {
      direction: {
        col: 1,
        row: 0,
      },
      pos: {
        col: 2,
        row: 2,
      },
    },
    {
      direction: {
        col: 0,
        row: 1,
      },
      pos: {
        col: 4,
        row: 5,
      },
    },
  ]);
});

Deno.test("Start data", () => {
  const { start, map } = extractData(simpleInput);
  assertEquals(start, {
    col: 1,
    row: 0,
  });
  assertEquals(map[start.row][start.col], ".");
});

Deno.test("end data", () => {
  const { end, map } = extractData(simpleInput);

  assertEquals(end, {
    col: 5,
    row: 6,
  });

  assertEquals(map[end.row][end.col], ".");
});

Deno.test("map data", () => {
  const { map } = extractData(simpleInput);

  assertEquals(
    map.map((e) => e.join("")),
    [
      "#.#####",
      "#.....#",
      "#.....#",
      "#.....#",
      "#.....#",
      "#.....#",
      "#####.#",
    ]
  );
});

Deno.test("Move Blizzard - simple", async (test) => {
  const { map, blizzard } = extractData(simpleInput);

  await test.step("1 time", () => {
    const movedBlizzard = blizzardMove(blizzard, {
      row: map.length,
      col: map[0].length,
    });
    assertEquals(
      calcCurrentMap(map, movedBlizzard).map((e) => e.join("")),
      [
        "#.#####",
        "#...v.#",
        "#..>..#",
        "#.....#",
        "#.....#",
        "#.....#",
        "#####.#",
      ]
    );
  });

  await test.step("2 times", () => {
    let movedBlizzard = blizzard;

    for (let i = 0; i < 2; i++) {
      movedBlizzard = blizzardMove(movedBlizzard, {
        row: map.length,
        col: map[0].length,
      });
    }

    assertEquals(
      calcCurrentMap(map, movedBlizzard).map((e) => e.join("")),
      [
        "#.#####",
        "#.....#",
        "#...2.#",
        "#.....#",
        "#.....#",
        "#.....#",
        "#####.#",
      ]
    );
  });

  await test.step("4 times", () => {
    let movedBlizzard = blizzard;

    for (let i = 0; i < 4; i++) {
      movedBlizzard = blizzardMove(movedBlizzard, {
        row: map.length,
        col: map[0].length,
      });
    }

    assertEquals(
      calcCurrentMap(map, movedBlizzard).map((e) => e.join("")),
      [
        "#.#####",
        "#.....#",
        "#>....#",
        "#.....#",
        "#...v.#",
        "#.....#",
        "#####.#",
      ]
    );
  });
});

Deno.test("Move Blizzard - complex", async (test) => {
  const { map, blizzard } = extractData(complexInput);

  await test.step("1 time", () => {
    const movedBlizzard = blizzardMove(blizzard, {
      row: map.length,
      col: map[0].length,
    });
    assertEquals(
      calcCurrentMap(map, movedBlizzard).map((e) => e.join("")),
      // prettier-ignore
      [
        "#.######", 
        "#.>3.<.#", 
        "#<..<<.#", 
        "#>2.22.#", 
        "#>v..^<#", 
        "######.#"
      ]
    );
  });

  await test.step("2 times", () => {
    let movedBlizzard = blizzard;

    for (let i = 0; i < 2; i++) {
      movedBlizzard = blizzardMove(movedBlizzard, {
        row: map.length,
        col: map[0].length,
      });
    }

    assertEquals(
      calcCurrentMap(map, movedBlizzard).map((e) => e.join("")),
      // prettier-ignore
      [
        "#.######", 
        "#.2>2..#", 
        "#.^22^<#", 
        "#.>2.^>#", 
        "#.>..<.#", 
        "######.#"
      ]
    );
  });

  await test.step("3 times", () => {
    let movedBlizzard = blizzard;

    for (let i = 0; i < 3; i++) {
      movedBlizzard = blizzardMove(movedBlizzard, {
        row: map.length,
        col: map[0].length,
      });
    }

    assertEquals(
      calcCurrentMap(map, movedBlizzard).map((e) => e.join("")),
      // prettier-ignore
      [
        "#.######", 
        "#<^<22.#", 
        "#.2<.2.#", 
        "#><2>..#", 
        "#..><..#", 
        "######.#"
      ]
    );
  });

  await test.step("4 times", () => {
    let movedBlizzard = blizzard;

    for (let i = 0; i < 4; i++) {
      movedBlizzard = blizzardMove(movedBlizzard, {
        row: map.length,
        col: map[0].length,
      });
    }

    assertEquals(
      calcCurrentMap(map, movedBlizzard).map((e) => e.join("")),
      // prettier-ignore
      [
        "#.######", 
        "#.<..22#", 
        "#<<.<..#", 
        "#<2.>>.#", 
        "#.^22^.#", 
        "######.#"
      ]
    );
  });
});

Deno.test("Phase 1", () => {
  assertEquals(phase1(complexInput), 18);
});

Deno.test("Phase 2", () => {
  assertEquals(phase2(simpleInput), 30);
});
