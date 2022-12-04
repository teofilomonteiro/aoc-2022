import { getPriorityOfThree, getTotalPriority } from "./lib.ts";

const __filename = new URL(".", import.meta.url).pathname;

const input = await Deno.readTextFile(`${__filename}/input.txt`);

console.log("Total priority", getTotalPriority(input));
console.log("Total priority with group 3", getPriorityOfThree(input));
