// Blueprint 2:
//  Each ore robot costs 2 ore.
//  Each clay robot costs 3 ore.
//  Each obsidian robot costs 3 ore and 8 clay.
//  Each geode robot costs 3 ore and 12 obsidian.

import { sum } from "../lib/index.ts";

type InQueue = {
  [key: string]: number;
};
export type Blueprint = [number, number, number, number, number, number];

export function extractData(input: string): Blueprint[] {
  return input.split("\n").map((line) => {
    const ore = line.match(/Each ore robot costs (\d+) ore/);
    const clay = line.match(/Each clay robot costs (\d+) ore/);
    const obsidian = line.match(
      /Each obsidian robot costs (\d+) ore and (\d+) clay/
    );
    const geode = line.match(
      /Each geode robot costs (\d+) ore and (\d+) obsidian/
    );

    if (ore === null || clay === null || obsidian === null || geode === null) {
      throw new Error("CAN'T READ LINE: " + line);
    }

    return [
      Number(ore[1]),
      Number(clay[1]),
      Number(obsidian[1]),
      Number(obsidian[2]),
      Number(geode[1]),
      Number(geode[2]),
    ];
  });
}

function buildUpdateQueue(Q: InQueue) {
  return (k: number[], v: number) => {
    Q[k.join(",")] = Math.max(Q[k.join(",")] ?? 0, v);
  };
}

function max(QUEUE: InQueue) {
  return Object.values(QUEUE).reduce(
    (max, current) => Math.max(max, current),
    -Infinity
  );
}

export function calcMaxBuild(blueprint: Blueprint, mins: number): number {
  const [
    blueprintOre,
    blueprintClay,
    blueprintObsidian1,
    blueprintObsidian2,
    blueprintGeodes1,
    blueprintGeodes2,
  ] = blueprint;

  const maxOre = Math.max(
    blueprintOre,
    blueprintClay,
    blueprintObsidian1,
    blueprintGeodes1
  );

  let QUEUE: InQueue = { "0,0,0,1,0,0": 0 };

  for (let minute = mins; minute > 1; minute--) {
    const maxGeodes = max(QUEUE);

    const Q: InQueue = {};
    const updateQueue = buildUpdateQueue(Q);

    for (const sysInfo of Object.keys(QUEUE)) {
      const geodes = QUEUE[sysInfo];
      const [ore, clay, obsesian, robotOre, robotClay, robotObsesian] = sysInfo
        .split(",")
        .map(Number);

      if (geodes + minute * minute - minute < maxGeodes) continue;

      const bOre =
        ore >= blueprintOre &&
        robotOre < maxOre &&
        ore + robotOre * minute < maxOre * minute;

      const bClay =
        ore >= blueprintClay &&
        robotClay < blueprintObsidian2 &&
        clay + robotClay * minute < blueprintObsidian2 * minute;

      const bObsesian =
        ore >= blueprintObsidian1 &&
        clay >= blueprintObsidian2 &&
        robotObsesian < blueprintGeodes2;

      const bGeodue = ore >= blueprintGeodes1 && obsesian >= blueprintGeodes2;

      if (bOre) {
        updateQueue(
          [
            ore + robotOre - blueprintOre,
            clay + robotClay,
            obsesian + robotObsesian,
            robotOre + 1,
            robotClay,
            robotObsesian,
          ],
          geodes
        );
      }

      if (bClay) {
        updateQueue(
          [
            ore + robotOre - blueprintClay,
            clay + robotClay,
            obsesian + robotObsesian,
            robotOre,
            robotClay + 1,
            robotObsesian,
          ],
          geodes
        );
      }

      if (bObsesian) {
        updateQueue(
          [
            ore + robotOre - blueprintObsidian1,
            clay + robotClay - blueprintObsidian2,
            obsesian + robotObsesian,
            robotOre,
            robotClay,
            robotObsesian + 1,
          ],
          geodes
        );
      }
      if (bGeodue) {
        updateQueue(
          [
            ore + robotOre - blueprintGeodes1,
            clay + robotClay,
            obsesian + robotObsesian - blueprintGeodes2,
            robotOre,
            robotClay,
            robotObsesian,
          ],
          geodes + minute - 1
        );
      }

      if ([!bOre, !bClay, !bObsesian, !bGeodue].some(Boolean)) {
        updateQueue(
          [
            ore + robotOre,
            clay + robotClay,
            obsesian + robotObsesian,
            robotOre,
            robotClay,
            robotObsesian,
          ],
          geodes
        );
      }
    }
    QUEUE = Q;
  }

  return max(QUEUE);
}

export function phase1(input: string) {
  const blueprints = extractData(input);

  const result = blueprints.map((blueprint) => calcMaxBuild(blueprint, 24));

  return sum(result.map((v, index) => v * (index + 1)));
}

export function phase2(input: string) {
  const blueprints = extractData(input);
  let mul = 1;
  for (let i = 0; i < Math.min(3, blueprints.length); i++) {
    console.log("calculate", i, "of", 3);

    const blueprint = blueprints[i];
    mul *= calcMaxBuild(blueprint, 32);
  }
  return mul;
}
