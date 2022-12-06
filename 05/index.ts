import { getContainers, phase1, phase2 } from "./lib.ts";

const __filename = new URL(".", import.meta.url).pathname;

const instructions = await Deno.readTextFile(`${__filename}/input.txt`);
const containers = `        [Q] [B]         [H]        
    [F] [W] [D] [Q]     [S]        
    [D] [C] [N] [S] [G] [F]        
    [R] [D] [L] [C] [N] [Q]     [R]
[V] [W] [L] [M] [P] [S] [M]     [M]
[J] [B] [F] [P] [B] [B] [P] [F] [F]
[B] [V] [G] [J] [N] [D] [B] [L] [V]
[D] [P] [R] [W] [H] [R] [Z] [W] [S]
 1   2   3   4   5   6   7   8   9`;
console.log("Phase 1 results", phase1(getContainers(containers), instructions));
console.log("Phase 2 results", phase2(getContainers(containers), instructions));
