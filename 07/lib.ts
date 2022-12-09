import { join } from "https://deno.land/std/path/mod.ts";

type TotalCache = {
  [key: string]: number;
};

type PathDetails = {
  [key: string]: string | number;
};

type Struct = {
  [path: string]: PathDetails;
};

export function getPaths(lines: string) {
  let currentPath = "/";
  let currentCommand = "";
  const struct: Struct = {};

  lines.split("\n").forEach((line) => {
    if (line.startsWith("$")) {
      const comand = line.split(" ");
      currentCommand = comand[1];
      if (currentCommand === "cd") {
        currentPath = join(currentPath, comand[2]);
      } else if (currentCommand === "ls" && !struct[currentPath]) {
        struct[currentPath] = {};
      } else {
        throw new Error("can't parse command");
      }
    } else {
      if (currentCommand === "ls") {
        const lsInfo = line.match(/^(\d+|dir) ([^ ]+)/);
        if (lsInfo) {
          if (lsInfo[1] != "dir") {
            struct[currentPath][lsInfo[2]] = Number(lsInfo[1]);
          } else {
            struct[currentPath][lsInfo[2]] = join(currentPath, lsInfo[2]);
          }
        }
      } else {
        throw new Error("can't parse line");
      }
    }
  });

  return struct;
}

export function calculateSize(
  struct: Struct,
  path: string,
  cache?: TotalCache
) {
  const fileSystem = struct[path];
  let total = 0;
  Object.keys(fileSystem).forEach((filename) => {
    const info = fileSystem[filename];

    if (typeof info === "number") {
      total += info;
    } else {
      if (cache && cache[info]) {
        total += cache[info];
      } else {
        total += calculateSize(struct, info, cache);
      }
    }
  });

  return total;
}

export function phase1(input: string) {
  const struct = getPaths(input);
  const cache: { [k: string]: number } = {};
  let total = 0;

  Object.keys(struct).forEach((path) => {
    cache[path] = calculateSize(struct, path, cache);
    if (cache[path] <= 100000) {
      total += cache[path];
    }
  });

  return total;
}
export function phase2(input: string) {
  const totalSpace = 70000000;
  const neededSpace = 30000000;
  const struct = getPaths(input);
  const cache: { [k: string]: number } = {};

  Object.keys(struct).forEach((path) => {
    cache[path] = calculateSize(struct, path, cache);
  });

  const availableSpace = totalSpace - cache["/"];

  let total = cache["/"];
  Object.keys(cache).forEach((path) => {
    if (availableSpace + cache[path] > neededSpace) {
      if (total > cache[path]) {
        total = cache[path];
      }
    }
  });

  return total;
}
