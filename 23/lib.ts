type Coordenates = [number, number];

type ElfCoordenates = Coordenates[];

export function extractData(input: string): ElfCoordenates {
  return input
    .split(/\r?\n/)
    .map((line) => line.split(""))
    .map((line, x) => line.map((cell, y) => (cell === "#" ? [x, y] : null)))
    .flat()
    .filter((coord): coord is Coordenates => coord !== null);
}

type DirectionsKeys = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
type Directions = {
  [key in DirectionsKeys]: Coordenates;
};

const directions: Directions = {
  "N": [-1, 0],
  "NE": [-1, 1],
  "E": [0, 1],
  "SE": [1, 1],
  "S": [1, 0],
  "SW": [1, -1],
  "W": [0, -1],
  "NW": [-1, -1],
};

function createAdjacentDirections() {
  return [
    (["N", "NE", "NW"] as DirectionsKeys[]).map((dir) => directions[dir]),
    (["S", "SE", "SW"] as DirectionsKeys[]).map((dir) => directions[dir]),
    (["W", "NW", "SW"] as DirectionsKeys[]).map((dir) => directions[dir]),
    (["E", "NE", "SE"] as DirectionsKeys[]).map((dir) => directions[dir]),
  ];
}

function toSet(elfCoords: ElfCoordenates) {
  return elfCoords.reduce(
    (acc, el) => acc.add(String(el)),
    new Set<string>(),
  );
}

function doCycle(
  elfCoords: ElfCoordenates,
  elfCoordsSet: Set<string>,
  adjacentDirs: ElfCoordenates[],
) {
  const nextCoords = Array(elfCoords.length).fill(null);
  const counter: { [key in string]: number } = {};

  for (let i = 0; i < elfCoords.length; i++) {
    const currentElfCoods = elfCoords[i];

    // there is no other Elves in one of those eight positions, the Elf don't do anything
    if (isStandStill(adjacentDirs, currentElfCoods, elfCoordsSet)) continue;

    // "the Elf looks in each of four directions in the following order and proposes moving one step in the first valid direction"
    const adjacentDirIndex = adjacentDirs.findIndex((adjacentDir) =>
      findAllAdjacent(adjacentDir, currentElfCoods, elfCoordsSet)
    );

    if (adjacentDirIndex === -1) {
      continue;
    }

    const [dirX, dirY] = adjacentDirs[adjacentDirIndex][0];

    nextCoords[i] = [
      currentElfCoods[0] + dirX,
      currentElfCoods[1] + dirY,
    ];

    const mapKey = String(nextCoords[i]);
    counter[mapKey] = (counter[mapKey] ?? 0) + 1;
  }

  let noMove = true;

  for (let i = 0; i < elfCoords.length; i++) {
    const nextCoord = nextCoords[i];

    if (nextCoord && counter[String(nextCoord)] === 1) {
      elfCoordsSet.delete(String(elfCoords[i]));
      elfCoords[i] = nextCoord;
      elfCoordsSet.add(String(elfCoords[i]));
      noMove = false;
    }
  }

  return noMove;
}

function findAllAdjacent(
  adjDirection: ElfCoordenates,
  [x, y]: Coordenates,
  elfCoordsSet: Set<string>,
) {
  return adjDirection
    .every(([dirX, dirY]) => !elfCoordsSet.has(String([x + dirX, y + dirY])));
}

function isStandStill(
  adjDirections: ElfCoordenates[],
  coord: Coordenates,
  coordsSet: Set<string>,
): boolean {
  return findAllAdjacent(adjDirections.flat(), coord, coordsSet);
}

export function phase1(input: string) {
  const elfCoords = extractData(input);

  const easyAccessElfCoords = toSet(elfCoords);

  let adjacentDirs = createAdjacentDirections();
  let rounds = 10;

  while (rounds--) {
    doCycle(elfCoords, easyAccessElfCoords, adjacentDirs);

    adjacentDirs = [...adjacentDirs.slice(1), adjacentDirs[0]];
  }

  const [maxX, minX, maxY, minY] = [0, 1]
    .map((idx) => elfCoords.map((d) => d[idx]))
    .flatMap((values) => [Math.max(...values), Math.min(...values)]);

  return (maxX - minX + 1) * (maxY - minY + 1) - elfCoords.length;
}

export function phase2(input: string) {
  const elfCoords = extractData(input);

  const elfCoordsSet = toSet(elfCoords);

  let adjacentDirs = createAdjacentDirections();
  let rounds = 0;

  while (++rounds) {
    if (doCycle(elfCoords, elfCoordsSet, adjacentDirs)) {
      return rounds;
    }

    adjacentDirs = [...adjacentDirs.slice(1), adjacentDirs[0]];
  }
}
