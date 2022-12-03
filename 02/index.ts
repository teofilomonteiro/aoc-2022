import { calculateResults1, calculateResults2 } from "./lib.ts";

const __filename = new URL(".", import.meta.url).pathname;

//A for Rock, B for Paper, and C for Scissors
//X for Rock, Y for Paper, and Z for Scissors

const input = await Deno.readTextFile(`${__filename}/input.txt`);

console.log("Total result v1", calculateResults1(input));
console.log("Total result v2", calculateResults2(input));
