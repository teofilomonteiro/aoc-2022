import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { calculateSize, getPaths, phase1, phase2 } from "./lib.ts";

const input = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

Deno.test("Parse command 1", () => {
  assertEquals(
    getPaths(`$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d`),
    {
      "/": { a: "/a", "b.txt": 14848514, "c.dat": 8504156, d: "/d" },
    }
  );
});

Deno.test("Parse command 2", () => {
  assertEquals(getPaths(input), {
    "/": { a: "/a", "b.txt": 14848514, "c.dat": 8504156, d: "/d" },
    "/a": {
      e: "/a/e",
      f: 29116,
      g: 2557,
      "h.lst": 62596,
    },
    "/a/e": {
      i: 584,
    },
    "/d": {
      "d.ext": 5626152,
      "d.log": 8033020,
      j: 4060174,
      k: 7214296,
    },
  });
});

Deno.test("Phase 1", () => {
  assertEquals(calculateSize(getPaths(input), "/a/e", {}), 584);
  assertEquals(calculateSize(getPaths(input), "/a", {}), 94853);
});

Deno.test("Phase 1", () => {
  assertEquals(phase1(input), 95437);
});

Deno.test("Phase 2", () => {
  assertEquals(phase2(input), 24933642);
});
