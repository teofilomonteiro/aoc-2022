type Blizzard = {
  direction: Position;
  pos: Position;
};

type LabirintMap = string[][];

type Data = {
  map: LabirintMap;
  blizzard: Blizzard[];
  start: Position;
  end: Position;
};
type Position = {
  row: number;
  col: number;
};

const BLIZZARD_TYPE = ["v", ">", "<", "^"] as const;

type Directions = typeof BLIZZARD_TYPE[number];

// prettier-ignore
const BLIZZARD_DIRECTIONS: { [key in Directions]: Position } = {
  ">": { col:  1, row:  0 }, // Right
  "v": { col:  0, row:  1 }, // Down
  "<": { col: -1, row:  0 }, // Left
  "^": { col:  0, row: -1 }, // Up
};
const MOVING_DIRECTIONS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [0, 0],
];

const isBlizzardType = (e: any): e is Directions => BLIZZARD_TYPE.includes(e);

export function extractData(input: string): Data {
  const blizzard: Blizzard[] = [];

  const map = input.split("\n").map((line) => line.split(""));

  const start: Position = {
    row: 0,
    col: 1,
  };

  const end: Position = {
    row: map.length - 1,
    col: map[0].length - 2,
  };

  for (let row = 1; row < map.length - 1; row++) {
    const rowData = map[row];

    for (let col = 1; col < rowData.length - 1; col++) {
      const element = rowData[col];

      if (isBlizzardType(element)) {
        blizzard.push({
          direction: BLIZZARD_DIRECTIONS[element],
          pos: { row, col },
        });

        map[row][col] = ".";
      }
    }
  }

  return {
    map,
    blizzard,
    start: start,
    end: end,
  };
}

export function blizzardMove(
  blizzards: Blizzard[],
  { row: rowLenght, col: collumnLenght }: { row: number; col: number }
): Blizzard[] {
  const newBlizzard: Blizzard[] = [];

  for (const { direction, pos } of blizzards) {
    const position: Position = {
      col: pos.col + direction.col,
      row: pos.row + direction.row,
    };

    if (position.row === rowLenght - 1) {
      position.row = 1;
    } else if (position.row === 0) {
      position.row = rowLenght - 2;
    }

    if (position.col === collumnLenght - 1) {
      position.col = 1;
    } else if (position.col === 0) {
      position.col = collumnLenght - 2;
    }

    newBlizzard.push({ pos: position, direction });
  }

  return newBlizzard;
}

const positionToString = ({ row, col }: Position) => `${row} ${col}`;
const visitedString = ({ row, col }: Position, step: number) =>
  `${row} ${col} ${step}`;

function toPrintLabirint(map: LabirintMap, pos?: Position) {
  const newMap = [...map.map((e) => [...e])];
  if (pos) newMap[pos.row][pos.col] = "E";

  return ["", ...newMap.map((e) => e.join("")), ""].join("\n");
}

function createBFS(
  end: Position,
  startBlizzard: Blizzard[],
  map: LabirintMap,
  numberOfRows: number,
  numberOfCols: number
) {
  const isPosInGrid = ({ row, col }: Position) =>
    row >= 0 && row < numberOfRows && col >= 0 && col < numberOfCols;
  const limit = { row: numberOfRows, col: numberOfCols };

  return (start: Position) => {
    let QUEUE = [start];
    let steps = 0;
    let res = Number.POSITIVE_INFINITY;
    let currentBlizzard = startBlizzard;

    const isPossibleToMove =
      (grid: LabirintMap) =>
      ({ row, col }: Position) =>
        grid[row][col] === ".";

    while (QUEUE.length) {
      if (QUEUE.map(positionToString).includes(positionToString(end))) {
        res = steps;
        break;
      }

      const queue: Position[] = [];
      const visited: Set<string> = new Set();
      steps++;
      currentBlizzard = blizzardMove(currentBlizzard, limit);

      const currentMap = calcMap(map, currentBlizzard);

      for (const pos of QUEUE) {
        MOVING_DIRECTIONS.map(([dRow, dCol]) => {
          return { row: pos.row + dRow, col: pos.col + dCol };
        })
          .filter(isPosInGrid)
          .filter(
            (thisPosition) =>
              positionToString(thisPosition) !== positionToString(start)
          )
          .filter((p) => !visited.has(positionToString(p)))
          .filter(isPossibleToMove(currentMap))
          .forEach((p) => {
            visited.add(positionToString(p));
            queue.push(p);
          });
      }

      QUEUE = queue;
    }

    return { res, currentBlizzard };
  };
}

export function phase1(input: string) {
  const { map, blizzard, end, start } = extractData(input);

  const bfs = createBFS(end, blizzard, map, map.length, map[0].length);
  return bfs(start).res;
}

export function phase2(input: string) {
  const {
    map,
    blizzard,
    end: endPosition,
    start: startPositon,
  } = extractData(input);
  let currentBlizzard = blizzard;
  let result = 0;
  [
    { start: startPositon, end: endPosition },
    { start: endPosition, end: startPositon },
    { start: startPositon, end: endPosition },
  ].forEach(({ start, end }) => {
    const bfs = createBFS(end, currentBlizzard, map, map.length, map[0].length);
    const final = bfs(start);
    result = result + final.res;
    currentBlizzard = final.currentBlizzard;
  });

  return result;
}

export const calcMap = (map: LabirintMap, blizzard: Blizzard[]) => {
  const mapWithBlizzards: LabirintMap = [...map.map((row) => [...row])];

  for (const { pos, direction } of blizzard) {
    mapWithBlizzards[pos.row][pos.col] = "#";
  }

  return mapWithBlizzards;
};

export const calcCurrentMap = (map: LabirintMap, blizzard: Blizzard[]) => {
  const mapWithBlizzards: LabirintMap = [...map.map((row) => [...row])];

  for (const { pos, direction } of blizzard) {
    if (mapWithBlizzards[pos.row][pos.col] === ".") {
      mapWithBlizzards[pos.row][pos.col] =
        BLIZZARD_TYPE.find(
          (key) =>
            BLIZZARD_DIRECTIONS[key].col === direction.col &&
            BLIZZARD_DIRECTIONS[key].row === direction.row
        ) ?? "O";
    } else {
      const number = Number(mapWithBlizzards[pos.row][pos.col]);
      mapWithBlizzards[pos.row][pos.col] = `${
        (Number.isNaN(number) ? 1 : number) + 1
      }`;
    }
  }

  return mapWithBlizzards;
};
