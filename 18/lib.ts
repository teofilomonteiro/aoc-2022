type Position = [number, number, number];

type Cubes = Position[];

export function extractData(input: string): Cubes {
  return input.split("\n").map((line) => line.split(",").map(Number)) as Cubes;
}

function calcNeighbors([x, y, z]: number[]) {
  return [
    [x + 1, y, z],
    [x, y + 1, z],
    [x, y, z + 1],
    [x - 1, y, z],
    [x, y - 1, z],
    [x, y, z - 1],
  ] as Position[];
}

export function sumSides(cubes: Position[]): number {
  let sum = 0;
  for (let i = 0; i < cubes.length; i++) {
    const cube = cubes[i];
    const neighbors = calcNeighbors(cube);

    for (let j = 0; j < neighbors.length; j++) {
      const n = neighbors[j];

      if (!arrayContains(cubes, n)) {
        sum++;
      }
    }
  }
  return sum;
}

function arrayContains(cubes: Position[], pos: Position) {
  return cubes.some((cube) => cube.every((v, i) => v === pos[i]));
}

export function phase1(input: string) {
  const cubes = extractData(input);
  return sumSides(cubes);
}
export function phase2(input: string) {
  const cubes = extractData(input);

  const [minPos, maxPos] = findMinAndMax(cubes);

  const queue = [minPos];
  const visited = [...cubes];

  let total = 0;

  while (queue.length > 0) {
    const cube = queue.shift() as Position;
    const neighbors = calcNeighbors(cube);

    for (let j = 0; j < neighbors.length; j++) {
      const cube = neighbors[j];

      if (!cubeIsBetween(minPos, maxPos, cube)) {
        continue;
      }

      total = total + Number(arrayContains(cubes, cube));

      if (!arrayContains(visited, cube)) {
        visited.push(cube);
        queue.push(cube);
      }
    }
  }

  return total;
}

function findMinAndMax(cubes: Cubes): [Position, Position] {
  return cubes.reduce(
    ([min, max], cube) => [
      cube.map((v, i) => Math.min(min[i], v - 1)) as Position,
      cube.map((v, i) => Math.max(max[i], v + 1)) as Position,
    ],
    [
      [+Infinity, +Infinity, +Infinity],
      [-Infinity, -Infinity, -Infinity],
    ]
  );
}

function cubeIsBetween(
  minPosition: Position,
  maxPosition: Position,
  cube: Position
) {
  return cube.every(
    (value, pos) => minPosition[pos] <= value && value <= maxPosition[pos]
  );
}
