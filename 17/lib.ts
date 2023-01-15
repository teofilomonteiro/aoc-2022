type Data = string[];

const board = [
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],
  [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [0, 1], [1, 0], [1, 1]],
];

function free(occupiedBoard: Set<string>, x: number, y: number) {
  return x >= 0 && x < 7 && y > 0 && !occupiedBoard.has(String([x, y]));
}

function canMove(
  occupiedBoard: Set<string>,
  piece: number,
  x: number,
  y: number,
) {
  return board[piece].every(([dx, dy]) => free(occupiedBoard, x + dx, y + dy));
}

function place(
  instructions: string,
  occupiedBoard: Set<string>,
  jet: number,
  piece: number,
  maxY: number,
) {
  let x = 2;
  let y = maxY + 5;

  while (canMove(occupiedBoard, piece, x, y - 1)) {
    y -= 1;
    if (instructions[jet] === "<" && canMove(occupiedBoard, piece, x - 1, y)) {
      x -= 1;
    }
    if (instructions[jet] === ">" && canMove(occupiedBoard, piece, x + 1, y)) {
      x += 1;
    }
    jet = (jet + 1) % instructions.length;
  }

  const newcells = board[piece].map(function (coord) {
    return [x + coord[0], y + coord[1]];
  });

  newcells.forEach((cell) => occupiedBoard.add(String(cell)));

  return [
    jet,
    (piece + 1) % board.length,
    Math.max(
      maxY,
      Math.max.apply(
        null,
        newcells.map(function (coord) {
          return coord[1];
        }),
      ),
    ),
  ];
}

function groundShape(inputSet: Set<string>, maxy: number) {
  function dfs(x: number, y: number, visited: Set<string>) {
    if (
      !free(inputSet, x, maxy + y) || visited.has(String([x, y])) ||
      visited.size > 20
    ) {
      return;
    }

    visited.add(String([x, y]));

    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1]]) {
      dfs(nx, ny, visited);
    }
  }

  const state = new Set<string>();

  for (let x = 0; x < 7; x++) {
    dfs(x, 0, state);
  }

  return (state.size <= 20) ? [...state] : null;
}

function solve(instructions: string, count: number) {
  const inputSet = new Set<string>();
  const cycles: { [key in string]: [number, number] } = {};

  let jet = 0, maxY = 0, piece = 0, additional = 0;

  while (count > 0) {
    [jet, piece, maxY] = place(instructions, inputSet, jet, piece, maxY);

    count--;

    const ground = groundShape(inputSet, maxY);

    if (ground === null) continue;

    const key = String([jet, piece, ground]);

    if (cycles[key]) {
      const [oldMaxY, oldCount] = cycles[key];
      additional += (maxY - oldMaxY) * Math.floor(count / (oldCount - count));
      count %= oldCount - count;
    }

    cycles[key] = [maxY, count];
  }

  return maxY + additional;
}

export function phase1(instructions: string) {
  return solve(instructions, 2022);
}
export function phase2(instructions: string) {
  return solve(instructions, 1000000000000);
}
