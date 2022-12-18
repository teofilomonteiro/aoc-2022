import { phase1, phase2 } from "./lib.ts";

const __filename = new URL(".", import.meta.url).pathname;

const input = await Deno.readTextFile(`${__filename}/input.txt`);

console.log("Phase 1 results", phase1(input));
console.log("Phase 2 results", phase2(input));
