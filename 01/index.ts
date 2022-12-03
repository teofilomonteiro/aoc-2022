import { sum } from "../lib/index.ts";

const __filename = new URL(".", import.meta.url).pathname;

const text = await Deno.readTextFile(`${__filename}/input.txt`);
const elfs: number[][] = [];
let tempElf: number[] = [];

text.split("\n").forEach((lines) => {
  if (lines !== "") {
    tempElf.push(Number(lines));
  } else {
    elfs.push(tempElf);
    tempElf = [];
  }
});
elfs.push(tempElf);

const caloriesPerElf = elfs.map((elf) => sum(elf));

function findIndicesOfMax(inp: number[], count: number) {
  const sorted = inp.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
  return sorted.slice(0, count);
}

console.log("Elf that has more calories:", Math.max(...caloriesPerElf));
console.log("Top 3 elves:", sum(findIndicesOfMax(caloriesPerElf, 3)));
