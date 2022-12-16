import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  phase1,
  phase2,
  parseLine,
  extractData,
  buildMap,
  calculateCoverage,
  coordinates,
  calculateLineCoverage,
} from "./lib.ts";

const input = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

Deno.test("Parse line", () => {
  assertEquals(
    parseLine("Sensor at x=2, y=18: closest beacon is at x=-2, y=15"),
    { sensor: { x: 2, y: 18 }, beacon: { x: -2, y: 15 } }
  );
});

Deno.test("extract data", () => {
  const sensorInfo = extractData(input);
  assertEquals(sensorInfo.length, 14);
  assertEquals(sensorInfo[0], {
    sensor: { x: 2, y: 18 },
    beacon: { x: -2, y: 15 },
  });
  assertEquals(sensorInfo[13], {
    sensor: { x: 20, y: 1 },
    beacon: { x: 15, y: 3 },
  });
});
// Deno.test("map", () => {
//   const { sensorBeacons, map } = buildMap(input);
//   assertEquals(sensorBeacons.length, 14);
//   console.log(map);
//   assertEquals(map.has("hello"), true);
// });

Deno.test("coverage of par beacon vs sensor", () => {
  const sensor = { x: 8, y: 7 };
  const beacon = { x: 2, y: 10 };
  const coverage = calculateCoverage({
    sensor,
    beacon,
  });

  assertEquals(coverage.has(coordinates(sensor)), true);
  assertEquals(coverage.has(coordinates(beacon)), true);

  // bondaries tests
  assertEquals(coverage.has(coordinates({ x: 2, y: 11 })), false);
  assertEquals(coverage.has(coordinates({ x: 1, y: 10 })), false);

  // border tests
  assertEquals(coverage.has(coordinates({ x: 8, y: -2 })), true);
  assertEquals(coverage.has(coordinates({ x: 8, y: 16 })), true);
  assertEquals(coverage.has(coordinates({ x: -1, y: 7 })), true);
  assertEquals(coverage.has(coordinates({ x: 1, y: 9 })), true);
});

Deno.test("coverage line coverage of pare beacon vs sensor", () => {
  const sensor = { x: 8, y: 7 };
  const beacon = { x: 2, y: 10 };
  const pair = {
    sensor,
    beacon,
  };

  let coverage = [...calculateLineCoverage(pair, 10)];

  assertEquals(coverage.length, 13);

  coverage = [...calculateLineCoverage(pair, 16)];

  assertEquals(coverage, [8]);
  coverage = [...calculateLineCoverage(pair, 7)];
  assertEquals(coverage.length, 9 * 2 + 1);
});

Deno.test("Phase 1", () => {
  assertEquals(phase1(input, 10), 26);
});

Deno.test("Phase 2", () => {
  assertEquals(phase2(input, 20), 56_000_011);
});
