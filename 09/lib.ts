type DirectionAmount = {
  direction: string;
  amount: number;
};

type Vector = [number, number];
type Rope = Vector[];

type MovementHistory = Vector[];

export const calculateDirectionAmount = (input: string): DirectionAmount => {
  const direction = input.charAt(0);
  const amount = parseInt(input.substring(2));

  return {
    direction,
    amount,
  };
};

// This function takes an array of tuples and returns a new array with only the unique tuples
function getUniqueTuples(tuples: MovementHistory): MovementHistory {
  const uniqueTuples: MovementHistory = [];
  tuples.forEach((tuple) => {
    let isUnique = true;
    uniqueTuples.forEach((uniqueTuple) => {
      if (tuple[0] === uniqueTuple[0] && tuple[1] === uniqueTuple[1]) {
        isUnique = false;
      }
    });

    if (isUnique) {
      uniqueTuples.push(tuple);
    }
  });
  return uniqueTuples;
}

// Function to calculate the Euler distance of two vectors
export function eulerDistance(vector1: number[], vector2: number[]): number {
  // Check if the two vectors are of the same length
  if (vector1.length !== vector2.length) {
    throw new Error("Vectors must be of the same length");
  }

  // Calculate the Euler distance
  let distance = 0;
  for (let i = 0; i < vector1.length; i++) {
    distance += Math.pow(vector1[i] - vector2[i], 2);
  }
  return Math.sqrt(distance);
}

export function movePieceT(
  coordinatesH: Vector,
  coordinatesT: Vector,
  direction: string
) {
  const newCoordinates: Vector = [coordinatesT[0], coordinatesT[1]];
  if (eulerDistance(coordinatesH, coordinatesT) >= 2) {
    if (
      coordinatesT[1] === coordinatesH[1] &&
      Math.abs(coordinatesT[0] - coordinatesH[0]) == 2
    ) {
      newCoordinates[0] += direction === "R" ? 1 : -1;
    } else if (
      coordinatesT[0] === coordinatesH[0] &&
      Math.abs(coordinatesT[1] - coordinatesH[1]) == 2
    ) {
      newCoordinates[1] += direction === "U" ? 1 : -1;
    } else {
      switch (direction) {
        case "U":
          newCoordinates[0] += coordinatesH[0] - coordinatesT[0] > 0 ? 1 : -1;
          newCoordinates[1] += 1;
          break;
        case "D":
          newCoordinates[0] += coordinatesH[0] - coordinatesT[0] > 0 ? 1 : -1;
          newCoordinates[1] -= 1;
          break;
        case "R":
          newCoordinates[0] += 1;
          newCoordinates[1] += coordinatesH[1] - coordinatesT[1] > 0 ? 1 : -1;
          break;
        case "L":
          newCoordinates[0] -= 1;
          newCoordinates[1] += coordinatesH[1] - coordinatesT[1] > 0 ? 1 : -1;
          break;
      }
    }
  }

  return newCoordinates;
}

export function movePiece(v1: Vector, movingVector: Vector): Vector {
  let [x, y] = movingVector;
  if (eulerDistance(v1, movingVector) >= 2) {
    const [v1X, v1Y] = v1;
    if (y === v1Y && Math.abs(x - v1X) >= 2) {
      const moveJump = Math.abs(v1X - x) - 1;
      const relativeDirection = Math.abs(v1X - x) / (v1X - x);
      x += relativeDirection * moveJump;
    } else if (x === v1X && Math.abs(y - v1Y) >= 2) {
      const moveJump = Math.abs(y - v1Y) - 1;
      const relativeDirection = Math.abs(v1Y - y) / (v1Y - y);
      y += relativeDirection * moveJump;
    } else {
      x += v1X - x > 0 ? 1 : -1;
      y += v1Y - y > 0 ? 1 : -1;
    }
  }

  return [x, y];
}

function moveH([x, y]: Vector, direction: string): Vector {
  switch (direction) {
    case "R":
      x += 1;
      break;
    case "L":
      x -= 1;
      break;
    case "U":
      y += 1;
      break;
    case "D":
      y -= 1;
      break;
  }

  return [x, y];
}

// coordinates
// x -> c[0]
// y -> c[1]

function printRope(rope: Rope) {
  const print: string[][] = [];
  const nrOfRows = 20;
  const nrOfColumns = 26;
  const [startX, startY]: Vector = [11, 5];

  for (let i = 0; i < nrOfRows; i++) {
    print[i] = [];
    for (let j = 0; j < nrOfColumns; j++) {
      print[i].push(".");
    }
  }

  const [x, y] = rope[0];
  print[startY + y][startX + x] = "0";

  for (let index = 1; index < rope.length; index++) {
    const [x, y] = rope[index];
    const printX = startX + x;
    const printY = startY + y;
    const pos = print[printY][printX];
    if (pos === "." || parseInt(pos) > index) {
      print[printY][printX] = `${index}`;
    }
  }

  // console.table(print.reverse());
  for (const line of print.reverse()) {
    console.log(line.map((pos) => (pos === "0" ? "H" : pos)).join(""));
  }
  console.log("\n");
}

export function phase1(input: string) {
  let coordinatesH: Vector = [0, 0];
  let coordinatesT: Vector = [0, 0];
  const historyT: MovementHistory = [];
  const lines = input.split("\n");
  lines.forEach((line) => {
    const { direction, amount } = calculateDirectionAmount(line);
    for (let step = 0; step < amount; step++) {
      coordinatesH = moveH(coordinatesH, direction);
      coordinatesT = movePieceT(coordinatesH, coordinatesT, direction);
      historyT.push(coordinatesT);
    }
  });

  return getUniqueTuples(historyT).length;
}

export function phase2(input: string) {
  const ropeSize = 10;
  const rope: Rope = [];

  for (let i = 0; i < ropeSize; i++) {
    rope.push([0, 0]);
  }

  const historyT: MovementHistory = [];
  const lines = input.split("\n");
  // printRope(rope);
  lines.forEach((line) => {
    const { direction, amount } = calculateDirectionAmount(line);
    for (let step = 0; step < amount; step++) {
      rope[0] = moveH(rope[0], direction);
      for (let i = 1; i < ropeSize; i++) {
        rope[i] = movePiece(rope[i - 1], rope[i]);
      }
      historyT.push(rope[ropeSize - 1]);
    }
    // printRope(rope);
  });

  return getUniqueTuples(historyT).length;
}
