export function phase1(input: string): number {
  const lines = extractData(input);

  const result = calculateBestPath(lines);

  return Math.max(...Object.values(result));
}

function calculateBestPath(lines: RegExpMatchArray[], min = 30) {
  const valveMap: { [key: string]: string[] } = {};
  const ratesMap: { [key: string]: number } = {};
  for (const x of lines) {
    valveMap[x[1]] = x[3].split(", ");
    if (parseInt(x[2]) !== 0) {
      ratesMap[x[1]] = parseInt(x[2]);
    }
  }

  const bitsMap: { [key: string]: number } = {};
  for (let i = 0; i < Object.keys(ratesMap).length; i++) {
    const x = Object.keys(ratesMap)[i];
    bitsMap[x] = 1 << i;
  }

  const pathMap: { [key: string]: { [key: string]: number } } = {};
  for (const x of Object.keys(valveMap)) {
    pathMap[x] = {};

    for (const y of Object.keys(valveMap)) {
      pathMap[x][y] = valveMap[x].includes(y) ? 1 : Infinity;
    }
  }

  for (const k of Object.keys(pathMap)) {
    for (const i of Object.keys(pathMap)) {
      for (const j of Object.keys(pathMap)) {
        pathMap[i][j] = Math.min(pathMap[i][j], pathMap[i][k] + pathMap[k][j]);
      }
    }
  }

  function visit(
    start: string,
    min: number,
    state: number,
    flow: number,
    answer: { [key: number]: number }
  ): { [key: number]: number } {
    answer[state] = Math.max(answer[state] ?? 0, flow);

    for (const u of Object.keys(ratesMap)) {
      const newbudget = min - pathMap[start][u] - 1;

      if ((bitsMap[u] & state) !== 0 || newbudget <= 0) continue;

      visit(
        u,
        newbudget,
        state | bitsMap[u],
        flow + newbudget * ratesMap[u],
        answer
      );
    }
    return answer;
  }

  return visit("AA", min, 0, 0, {});
}

function extractData(input: string) {
  return input.split("\n").map((line) => {
    const result = line.match(
      /^Valve ([A-Z]{2}) has flow rate=(\d+); tunnel[s]* lead[s]* to valve[s]* ([, A-Z]+)$/
    );

    if (result === null) {
      throw new Error("ERROR PARSING");
    }
    return result;
  });
}

export function phase2(input: string) {
  const lines = extractData(input);

  const visited2 = calculateBestPath(lines, 26);

  const result = Object.entries(visited2)
    .flatMap(([k1, v1]) =>
      Object.entries(visited2).map(([k2, v2]) =>
        !(Number(k1) & Number(k2)) ? v1 + v2 : -Infinity
      )
    )
    .filter((x) => x !== -Infinity);

  return result.reduce(
    (previous, current) => (current > previous ? current : previous),
    0
  );
}
