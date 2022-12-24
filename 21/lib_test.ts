import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  extractData,
  monkeysTreated,
  phase1,
  phase2,
  solveInOrderOf,
} from "./lib.ts";

const input = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

Deno.test("Extract data", () => {
  assertEquals(extractData(input), {
    root: "pppw + sjmn",
    dbpl: 5,
    cczh: "sllz + lgvd",
    zczc: 2,
    ptdq: "humn - dvpt",
    dvpt: 3,
    lfqf: 4,
    humn: 5,
    ljgn: 2,
    sjmn: "drzm * dbpl",
    sllz: 4,
    pppw: "cczh / lfqf",
    lgvd: "ljgn * ptdq",
    drzm: "hmdt - zczc",
    hmdt: 32,
  });
});

Deno.test("Monkeys treated", () => {
  const monkeys = extractData(input);
  assertEquals(monkeysTreated(monkeys), {
    cczh: "4 + lgvd",
    drzm: 30,
    lgvd: "2 * ptdq",
    pppw: "cczh / 4",
    ptdq: 2,
    root: "pppw + sjmn",
    sjmn: "drzm * 5",
  });
});

Deno.test("Phase 1", () => {
  assertEquals(phase1(input), 152);
});

Deno.test("solveInOrderOf", () => {
  assertEquals(solveInOrderOf("cczh / 4", 150), { key: "cczh", result: 600 });
  assertEquals(solveInOrderOf("10 - cbcc", 5), {
    key: "cbcc",
    result: 5,
  });
  assertEquals(solveInOrderOf("cbcc - 10", 5), {
    key: "cbcc",
    result: 15,
  });
});

Deno.test("Phase 2", () => {
  assertEquals(phase2(input), 301);
});
