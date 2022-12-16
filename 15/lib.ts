type Positon = {
  x: number;
  y: number;
};

type SensorBeaconPair = {
  sensor: Positon;
  beacon: Positon;
};

type Range = {
  min: number;
  max: number;
};

export function extractData(input: string): SensorBeaconPair[] {
  return input.split("\n").map(parseLine);
}
const toPostion = (text: string): Positon => {
  const posX = text.match(/x=(-*\d+)/);
  const posY = text.match(/y=(-*\d+)/);

  if (!posX || !posY) {
    throw new Error("Not found x or y");
  }

  return { x: Number(posX[1]), y: Number(posY[1]) };
};

export function parseLine(line: string): SensorBeaconPair {
  const [textSensor, textBeacon] = line.split("closest beacon");

  return {
    sensor: toPostion(textSensor),
    beacon: toPostion(textBeacon),
  };
}

export const coordinates = ({ x, y }: Positon) => `x=${x}, y=${y}`;

export function buildMap(input: string) {
  const data = extractData(input);
  const map = new Set<string>();

  data.forEach(({ beacon, sensor }) => {
    map.add(coordinates(beacon));
    map.add(coordinates(sensor));
  });

  return { sensorBeacons: data, map };
}

export function calculateCoverage({
  sensor,
  beacon,
}: SensorBeaconPair): Set<string> {
  const coverage = new Set<string>();
  const { x: sX, y: sY } = sensor;
  const { x: bX, y: bY } = beacon;

  const length = Math.abs(sX - bX) + Math.abs(sY - bY);

  let deltaX = 0;

  for (let y = length; y >= 0; y--) {
    for (let x = -deltaX; x <= deltaX; x++) {
      coverage.add(coordinates({ x: x + sX, y: sY - y }));
      coverage.add(coordinates({ x: x + sX, y: sY + y }));
    }

    deltaX += 1;
  }

  return coverage;
}

export function calculateLineCoverage(
  { sensor, beacon }: SensorBeaconPair,
  line: number
): number[] {
  const coverage: number[] = [];
  const { x: sX, y: sY } = sensor;
  const { x: bX, y: bY } = beacon;

  const radius = Math.abs(sX - bX) + Math.abs(sY - bY);

  if (sY - radius <= line && line <= sY + radius) {
    const deltaX = radius - Math.abs(line - sY);

    coverage.push(sX);

    for (let x = 1; x <= deltaX; x++) {
      coverage.push(sX + x);
      coverage.push(sX - x);
    }
  }

  return coverage;
}

export function calculateLineCoverageV2(
  { sensor, beacon }: SensorBeaconPair,
  line: number
): { min: number; max: number } | undefined {
  const { x: sX, y: sY } = sensor;
  const { x: bX, y: bY } = beacon;

  const radius = Math.abs(sX - bX) + Math.abs(sY - bY);

  if (sY - radius <= line && line <= sY + radius) {
    const deltaX = radius - Math.abs(line - sY);

    return { min: sX - deltaX, max: sX + deltaX };
  }

  return;
}

export function phase1(input: string, yPos: number) {
  const data = extractData(input);
  const sbPositions = data
    .flatMap(({ sensor, beacon }) => [sensor, beacon])
    .filter(({ y }) => y === yPos)
    .map(({ x }) => x);

  const coverage = data.flatMap((pair) =>
    calculateLineCoverage(pair, yPos).filter(
      (pos) => !sbPositions.includes(pos)
    )
  );

  return [...new Set(coverage)].length;
}

function reduceRanges(ranges: Range[]): Range[] {
  let results = [...ranges];
  if (ranges.length === 1) {
    return ranges;
  }

  let i = 0;
  do {
    const { min, max } = results[i];

    const updated = results
      .slice(i)
      .filter(({ max: cMax, min: cMin }) => !(cMin >= min && cMax <= max));

    results = [...results.slice(0, i + 1), ...updated];
    i++;
  } while (i < results.length);

  const cycles = results.length;
  for (let j = 0; j < cycles; j++) {
    i = 0;
    do {
      const { min: lMin, max: lMax } = results[i];
      const { min: uMin, max: uMax } = results[i + 1];
      if ((lMin <= uMin && lMax >= uMin) || lMax + 1 === uMin) {
        results = [
          ...results.slice(0, i),
          {
            min: lMin,
            max: uMax,
          },
          ...results.slice(i + 2),
        ];
      }
      i++;
    } while (i < results.length - 1);
    if (results.length === 1) {
      return results;
    }
  }

  return results;
}

export function phase2(input: string, maxY: number) {
  for (let yPos = 0; yPos < maxY; yPos++) {
    const data = extractData(input);

    const coverage = data
      .flatMap((pair) => calculateLineCoverageV2(pair, yPos))
      .filter((x) => x !== undefined) as Range[];
    coverage.sort((a, b) => a.min - b.min);

    const ranges = reduceRanges(coverage);
    if (ranges.length === 2) {
      return 4_000_000 * (ranges[0].max + 1) + yPos;
    }
  }
  throw new Error("COULDN'T FOUND NUMBER");
}
