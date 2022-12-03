import { sum } from "../lib/index.ts";

type PlayerAKey = "A" | "B" | "C";
type GameType = "X" | "Y" | "Z";

type Game = "Rock" | "Paper" | "Scissors";
// X lose, Y draw, Z win. Good luck!"
type ResultType = "Lose" | "Draw" | "Win";

type PlayerAMapping = {
  [Key in PlayerAKey]: Game;
};

type PlayerBMapping = {
  [Key in GameType]: Game;
};

type GameResult = {
  [Key in GameType]: ResultType;
};

const points: { [Key in Game]: number } = {
  Rock: 1,
  Paper: 2,
  Scissors: 3,
};

const playerAMapping: PlayerAMapping = {
  A: "Rock",
  B: "Paper",
  C: "Scissors",
};

const transformInput = (input: string) =>
  input.split("\n").map((line) => line.split(" ") as [PlayerAKey, GameType]);

export function calculateResults1(input: string): number {
  const games = transformInput(input);

  const playerB: PlayerBMapping = { X: "Rock", Y: "Paper", Z: "Scissors" };

  const rockScissorsPaper = games.map(([playerAGame, playerBGame]) => {
    return [playerAMapping[playerAGame], playerB[playerBGame]] as [Game, Game];
  });

  const gameResults = rockScissorsPaper.map(([pA, pB]) => {
    const figurePoint = points[pB];

    // draw
    if (pA === pB) {
      return 3 + figurePoint;
    }

    // Win
    if (
      (pA === "Rock" && pB === "Paper") ||
      (pA === "Paper" && pB === "Scissors") ||
      (pA === "Scissors" && pB === "Rock")
    ) {
      return 6 + figurePoint;
    }

    return figurePoint;
  });

  return sum(gameResults);
}

export function calculateResults2(input: string): number {
  const games = transformInput(input);

  const gameResult: GameResult = { X: "Lose", Y: "Draw", Z: "Win" };

  const rockScissorsPaper = games.map(([playerAGame, playerBGame]) => {
    return [playerAMapping[playerAGame], gameResult[playerBGame]] as [
      Game,
      ResultType
    ];
  });

  const gameResults = rockScissorsPaper.map(([pA, pB]) => {
    if (pB === "Draw") {
      return 3 + points[pA];
    }

    let figurePoint;
    if (pB === "Win") {
      if (pA === "Paper") {
        figurePoint = points["Scissors"];
      } else if (pA === "Rock") {
        figurePoint = points["Paper"];
      } else {
        figurePoint = points["Rock"];
      }

      return 6 + figurePoint;
    }

    if (pA === "Paper") {
      figurePoint = points["Rock"];
    } else if (pA === "Rock") {
      figurePoint = points["Scissors"];
    } else {
      figurePoint = points["Paper"];
    }

    return figurePoint;
  });

  return sum(gameResults);
}
