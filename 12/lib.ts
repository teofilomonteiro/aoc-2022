export type Maze = string[][];
type Position = {
  row: number;
  col: number;
};

const DIRECTIONS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const toMaze = (input: string) => {
  const data = input.split("\n").map((x) => x.split(""));

  const [numberOfRows, numberOfCols] = [data.length, data[0].length];

  let start, end;

  for (let row = 0; row < numberOfRows; row++) {
    for (let col = 0; col < numberOfCols; col++) {
      if (data[row][col] === "S") {
        start = { row, col };
        data[row][col] = "a";
      } else if (data[row][col] === "E") {
        end = { row, col };
        data[row][col] = "z";
      }
    }
  }

  if (!start || !end) {
    throw new Error("NOT defined");
  }

  return {
    grid: data,
    start,
    end,
    numberOfRows,
    numberOfCols,
  };
};

const positionToString = ({ row, col }: Position) => `${row} ${col}`;

const isAtMostOneHigher =
  (currentElevation: string, grid: string[][]) =>
  ({ row, col }: Position) =>
    grid[row][col].charCodeAt(0) - currentElevation.charCodeAt(0) <= 1;

function createBFS(
  end: Position,
  grid: string[][],
  numberOfRows: number,
  numberOfCols: number
) {
  const isPosInGrid = ({ row, col }: Position) =>
    row >= 0 && row < numberOfRows && col >= 0 && col < numberOfCols;

  return (start: Position) => {
    const queue = [[start, 0]];
    const visited = new Set([positionToString(start)]);
    let res = Number.POSITIVE_INFINITY;

    while (queue.length) {
      const [pos, steps] = queue.shift() as [Position, number];

      if (positionToString(pos) === positionToString(end)) {
        res = steps;
        break;
      }

      DIRECTIONS.map(([dRow, dCol]) => {
        return { row: pos.row + dRow, col: pos.col + dCol };
      })
        .filter(isPosInGrid)
        .filter(isAtMostOneHigher(grid[pos.row][pos.col], grid))
        .filter((pos) => !visited.has(positionToString(pos)))
        .forEach((pos) => {
          visited.add(positionToString(pos));
          queue.push([pos, steps + 1]);
        });
    }

    return res;
  };
}

export function phase1(input: string) {
  const { grid, start, end, numberOfRows, numberOfCols } = toMaze(input);

  const bfs = createBFS(end, grid, numberOfRows, numberOfCols);

  return bfs(start);
}

export function phase2(input: string) {
  const { grid, end, numberOfRows, numberOfCols } = toMaze(input);

  const isElevationA = ({ row, col }: Position) => grid[row][col] === "a";

  const bfs = createBFS(end, grid, numberOfRows, numberOfCols);

  const starts = Array.from({ length: numberOfRows }, (_, row) =>
    Array.from({ length: numberOfRows }, (_, col) => {
      return {
        row,
        col,
      };
    })
  )
    .flat()
    .filter(isElevationA);

  return Math.min(...starts.map(bfs));
}
