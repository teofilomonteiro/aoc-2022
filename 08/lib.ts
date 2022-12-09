export type Board = number[][];

export function readBoard(input: string) {
  return input.split("\n").map((l) => l.split("").map(Number));
}

export function countEdges(board: Board) {
  return (board.length - 2) * 2 + board[0].length * 2;
}

export function countInsideVisible(board: Board) {
  let count = 0;

  for (let i = 1; i < board.length - 1; i++) {
    for (let j = 1; j < board[i].length - 1; j++) {
      if (isVisible(i, j, board)) {
        count += 1;
      }
    }
  }

  return count;
}

export function isVisible(row: number, collumn: number, board: Board) {
  const tree = board[row][collumn];

  // Up side

  // left side
  if (leftVisibility(tree, board, row, collumn)) return true;

  // right side
  if (rightVisibility(tree, board, row, collumn)) return true;

  if (topVisibility(tree, board, row, collumn)) return true;

  return downVisibility(tree, board, row, collumn);
}

function downVisibility(
  tree: number,
  board: Board,
  row: number,
  collumn: number
) {
  let visible = true;

  for (let i = row + 1; i < board.length; i++) {
    visible = visible && tree > board[i][collumn];
  }
  return visible;
}

function topVisibility(
  tree: number,
  board: Board,
  row: number,
  collumn: number
) {
  let visible = true;

  for (let i = row - 1; i >= 0; i--) {
    visible = visible && tree > board[i][collumn];
  }

  return visible;
}

function leftVisibility(
  tree: number,
  board: Board,
  row: number,
  collumn: number
): boolean {
  return board[row]
    .slice(0, collumn)
    .reverse()
    .every((otherTrees) => otherTrees < tree);
}

function rightVisibility(
  tree: number,
  board: Board,
  row: number,
  collumn: number
): boolean {
  return board[row].slice(collumn + 1).every((otherTrees) => otherTrees < tree);
}

export function visibleCount(
  board: Board,
  row: number,
  collumn: number
): number {
  const tree = board[row][collumn];
  let count = 0;

  for (const otherTree of board[row].slice(collumn + 1)) {
    count += 1;

    if (otherTree >= tree) {
      break;
    }
  }

  let result = count;
  count = 0;
  for (const otherTree of board[row].slice(0, collumn).reverse()) {
    count += 1;

    if (otherTree >= tree) {
      break;
    }
  }

  result *= count;
  count = 0;
  for (let i = row - 1; i >= 0; i--) {
    const otherTree = board[i][collumn];

    count += 1;
    if (otherTree >= tree) {
      break;
    }
  }

  result *= count;
  count = 0;
  for (let i = row + 1; i < board.length; i++) {
    const otherTree = board[i][collumn];

    count += 1;
    if (otherTree >= tree) {
      break;
    }
  }

  return result * count;
}

export function phase1(input: string) {
  const board = readBoard(input);
  return countInsideVisible(board) + countEdges(board);
}

export function phase2(input: string) {
  const board = readBoard(input);

  let hightScore = 0;

  for (let row = 1; row < board.length - 1; row++) {
    for (let collumn = 1; collumn < board[row].length - 1; collumn++) {
      const tmp = visibleCount(board, row, collumn);

      if (tmp > hightScore) {
        hightScore = tmp;
      }
    }
  }

  return hightScore;
}
