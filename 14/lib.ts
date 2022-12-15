type Obstacles = Set<string>;

const coordinates = (x: number, y: number) => `${x} ${y}`;

const readData = (input: string) => {
  const data = input
    .split(/\r?\n/)
    .map((line) =>
      line.split(" -> ").map((number) => number.split(",").map(Number))
    );

  const obstacles: Obstacles = new Set();
  let maxY = Number.NEGATIVE_INFINITY;

  for (const line of data) {
    for (let i = 0; i < line.length - 1; i++) {
      let [x1, y1] = line[i];
      let [x2, y2] = line[i + 1];

      [x1, x2] = [x1, x2].sort((a, b) => a - b);
      [y1, y2] = [y1, y2].sort((a, b) => a - b);

      for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
          obstacles.add(coordinates(x, y));
          maxY = Math.max(maxY, y);
        }
      }
    }
  }

  return { obstacles, maxY };
};

const DIRECTIONS = [
  [0, 1], // down
  [-1, 1], // down left
  [1, 1], // down right
];

export function phase1(input: string) {
  const { obstacles, maxY } = readData(input);

  let numberOfDrops = 0;

  function drop(x: number, y: number): boolean {
    if (y > maxY) {
      return false;
    }

    for (const [dx, dy] of DIRECTIONS) {
      const [newX, newY] = [x + dx, y + dy];

      if (!obstacles.has(coordinates(newX, newY))) {
        return drop(newX, newY);
      }
    }

    numberOfDrops++;
    obstacles.add(coordinates(x, y));

    return true;
  }

  while (1) {
    const hasNextDrop = drop(500, 0);
    if (!hasNextDrop) break;
  }

  return numberOfDrops;
}
export function phase2(input: string) {
  const { obstacles, maxY } = readData(input);

  let numberOfDrops = 0;

  function drop(x: number, y: number): boolean {
    if (obstacles.has(coordinates(x, y))) {
      return false;
    }

    if (y < maxY + 1)
      for (const [dx, dy] of DIRECTIONS) {
        const [newX, newY] = [x + dx, y + dy];

        if (!obstacles.has(coordinates(newX, newY))) {
          return drop(newX, newY);
        }
      }

    numberOfDrops++;
    obstacles.add(coordinates(x, y));

    return true;
  }

  while (1) {
    const hasNextDrop = drop(500, 0);
    if (!hasNextDrop) break;
  }

  return numberOfDrops;
}
