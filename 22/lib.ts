export type WorldMap = string[][];

type Edge = {
  start: number;
  end: number;
};

type MatrixDirection = "row" | "collumn";

export type Positon = {
  [key in MatrixDirection]: number;
};

type EdgesMap = {
  [key in MatrixDirection]: Edge[];
};

export const DIRECTIONS = ["right", "down", "left", "up"] as const;

export type Direction = typeof DIRECTIONS[number];

type StepDirection = -1 | 1;

type Movement = {
  direction: Direction;
  nrOfSteps: number;
};

export function extractData(input: string): {
  map: WorldMap;
  directions: string[];
} {
  const data = input.split("\n");
  const directions = [
    ...`R${data[data.length - 1]}`.matchAll(/([LR]*\d+)/g),
  ].map((v) => v[1]);

  const map = data
    .slice(0, data.length - 2)
    .map((line) => line.split("").map((char) => (char === " " ? "" : char)));
  return { map, directions };
}

export function findStart(map: WorldMap): Positon {
  for (let i = 0; i < map.length; i++) {
    const row = map[i];
    for (let j = 0; j < row.length; j++) {
      const element = row[j];
      if (element === ".") {
        return { row: i, collumn: j };
      }
    }
  }

  throw new Error("Couldn't find beging");
}

export function buildEdges(map: WorldMap) {
  const rowDirectionsEdge: Edge[] = [];

  for (const row of map) {
    const indeces = row.reduce((acc, x, index) => {
      if (x) {
        acc.push(index);
      }
      return acc;
    }, [] as number[]);

    rowDirectionsEdge.push({
      start: indeces[0],
      end: indeces[indeces.length - 1],
    });
  }

  const collumnDirectionsEdge = map
    .reduce((acc, row, index) => {
      for (let i = 0; i < row.length; i++) {
        const element = row[i];
        if (element) {
          if (!acc[i]) acc[i] = [];
          acc[i].push(index);
        }
      }

      return acc;
    }, [] as number[][])
    .map((row) => ({ start: row[0], end: row[row.length - 1] } as Edge));

  return { row: rowDirectionsEdge, collumn: collumnDirectionsEdge };
}

export function translateToMapDirection(direction: Direction): {
  rowOrCollumn: MatrixDirection;
  stepDirection: StepDirection;
} {
  if (direction === "down" || direction === "up") {
    return {
      rowOrCollumn: "collumn",
      stepDirection: direction === "down" ? 1 : -1,
    };
  }

  return { rowOrCollumn: "row", stepDirection: direction === "left" ? -1 : 1 };
}

export function nextPositionInFlatEarth(
  { row, collumn }: Positon,
  stepDirection: number,
  rowOrCollumn: MatrixDirection,
  edgesMap: EdgesMap
): Positon {
  const edges = edgesMap[rowOrCollumn];

  if (rowOrCollumn === "row") {
    const { start, end } = edges[row];
    if (stepDirection === -1 && collumn === start) {
      return { row, collumn: end };
    } else if (stepDirection === 1 && collumn === end) {
      return { row, collumn: start };
    } else {
      return { row, collumn: collumn + stepDirection };
    }
  }

  const { start, end } = edges[collumn];

  if (stepDirection === -1 && row === start) {
    return { row: end, collumn };
  }

  if (stepDirection === 1 && row === end) {
    return { row: start, collumn };
  }

  return { row: row + stepDirection, collumn };
}

export function moveInMap(
  pos: Positon,
  movement: Movement,
  map: WorldMap,
  nextPostion: (direction: Direction, position: Positon) => Positon
) {
  let currentPostion = Object.assign(pos, {});
  const { nrOfSteps, direction } = movement;

  for (let i = 1; i <= nrOfSteps; i++) {
    const nextPosition = nextPostion(direction, currentPostion);

    if (map[nextPosition.row][nextPosition.collumn] === "#") {
      return currentPostion;
    }

    currentPostion = nextPosition;
  }

  return currentPostion;
}

export const calcNextMovement = (
  input: string,
  currentDirection: Direction
): Movement => {
  const turn = input.charAt(0) as "L" | "R";

  const index = DIRECTIONS.findIndex((value) => value === currentDirection);

  const step = turn === "L" ? -1 : 1;

  const direction = DIRECTIONS[(index + step + 4) % 4];

  const nrOfSteps = Number(input.substring(1));

  if (Number.isNaN(nrOfSteps)) {
    throw new Error("Couldn't parse nr of steps");
  }

  return { direction, nrOfSteps };
};

export function walkFlatEarth(
  direction: Direction,
  currentPostion: Positon,
  edgesMap: EdgesMap
) {
  const { rowOrCollumn, stepDirection } = translateToMapDirection(direction);

  const nextPosition = nextPositionInFlatEarth(
    currentPostion,
    stepDirection,
    rowOrCollumn,
    edgesMap
  );

  return nextPosition;
}

export function phase1(input: string) {
  const { map, directions } = extractData(input);

  const movements = directions.slice(1).reduce(
    (acc, direction) => {
      acc.push(calcNextMovement(direction, acc[acc.length - 1].direction));
      return acc;
    },
    [calcNextMovement(directions[0], "up")]
  );

  let currentPostion = findStart(map);
  const edgesMap = buildEdges(map);

  for (const movement of movements) {
    currentPostion = moveInMap(
      currentPostion,
      movement,
      map,
      (direction, currentPostion) =>
        walkFlatEarth(direction, currentPostion, edgesMap)
    );
  }

  const { row, collumn } = currentPostion;

  return (
    1_000 * (row + 1) +
    4 * (collumn + 1) +
    diretionToPoints(movements[movements.length - 1].direction)
  );
}

const DIR: Positon[] = [
  { collumn: 1, row: 0 }, //  Right
  { collumn: 0, row: 1 }, //  Down
  { collumn: -1, row: 0 }, // Left
  { collumn: 0, row: -1 }, // Up
];

const Inf = Infinity;
const [RIGHT, DOWN, LEFT, UP] = [0, 1, 2, 3];
// prettier-ignore
const wrappingRules: {search: Positon, transform:(input: Positon) => [Positon, number]}[][]= [ 
[ // Right
  {search: {collumn: Inf, row:  50}, transform: ({row}) => [{ collumn: 99,        row: 149 - row }, LEFT]},
  {search: {collumn: Inf, row: 100}, transform: ({row}) => [{ collumn: row + 50,  row:        49 },   UP]},
  {search: {collumn: Inf, row: 150}, transform: ({row}) => [{ collumn: 149,       row: 149 - row }, LEFT]},
  {search: {collumn: Inf, row: 200}, transform: ({row}) => [{ collumn: row - 100, row:       149 },   UP]},
],
[ // Down           
  {search: {collumn: 50,  row: Inf}, transform: ({collumn}) => [{ collumn: collumn + 100, row:             0 }, DOWN]},
  {search: {collumn: 100, row: Inf}, transform: ({collumn}) => [{ collumn:            49, row: collumn + 100 }, LEFT]},
  {search: {collumn: 150, row: Inf}, transform: ({collumn}) => [{ collumn:            99, row:  collumn - 50 }, LEFT]},
],
[ // Left
  {search: {collumn: Inf, row:  50}, transform: ({row}) => [{ collumn:         0, row: 149 - row }, RIGHT]},
  {search: {collumn: Inf, row: 100}, transform: ({row}) => [{ collumn: row -  50, row:       100 },  DOWN]},
  {search: {collumn: Inf, row: 150}, transform: ({row}) => [{ collumn:        50, row: 149 - row }, RIGHT]},
  {search: {collumn: Inf, row: 200}, transform: ({row}) => [{ collumn: row - 100, row:         0 },  DOWN]},
],
[ // Up             
  {search: {collumn: 50,  row: Inf}, transform: ({collumn}) => [{ collumn: 50,            row: collumn +  50 }, RIGHT]},
  {search: {collumn: 100, row: Inf}, transform: ({collumn}) => [{ collumn: 0,             row: collumn + 100 }, RIGHT]},
  {search: {collumn: 150, row: Inf}, transform: ({collumn}) => [{ collumn: collumn - 100, row:           199 },    UP]},
]];

export const aroundCubeEarth = (
  map: WorldMap,
  instructions: [number, number][],
  start: { position: Positon; direction: number }
) =>
  instructions.reduce(({ position, direction }, [turn, steps]) => {
    let currentDirection = (direction = (direction + 4 + turn) % 4);
    let currentPosition, mapElement;

    while (
      (mapElement = map[position.row]?.[position.collumn]) !== "#" &&
      steps >= 0
    ) {
      if (mapElement) {
        currentPosition = position;
        currentDirection = direction;

        steps--;

        const otherPosition = DIR[currentDirection];
        position = addPosition(otherPosition, position);
      } else {
        const foundPosition = wrappingRules[currentDirection].find(
          ({ search }) =>
            position.collumn < search.collumn && position.row < search.row
        );

        if (!foundPosition) throw new Error("not found position");

        [position, direction] = foundPosition.transform(position);
      }
    }

    if (!currentPosition) throw new Error("not found position");

    return { position: currentPosition, direction: currentDirection };
  }, start);

const addPosition = (pos1: Positon, pos2: Positon): Positon => ({
  collumn: pos1.collumn + pos2.collumn,
  row: pos1.row + pos2.row,
});

export function phase2(input: string) {
  const { map, directions: notProcessedDirections } = extractData(input);
  const directions = notProcessedDirections
    .map((d) => d.match(/([LR])(\d+)/))
    .filter((a): a is string[] => a !== null)
    .map(
      ([, a, b]) =>
        [(a === "L" ? -1 : 1) as StepDirection, Number(b)] as [number, number]
    );

  const startPostion = {
    position: findStart(map),
    direction: -1,
  };

  const { position, direction } = aroundCubeEarth(
    map,
    directions,
    startPostion
  );

  return 1_000 * (position.row + 1) + 4 * (position.collumn + 1) + direction;
}

export function diretionToPoints(direction: Direction): number {
  return DIRECTIONS.findIndex((value) => value === direction);
}
