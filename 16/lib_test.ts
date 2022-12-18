import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { phase1, phase2 } from "./lib.ts";

const input = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`;

// Deno.test("Extract data => 1 Set", () => {
//   assertEquals(
//     extractData(
//       "Valve AA has flow rate=0; tunnels lead to valves KH, EJ, OM, TY, DO"
//     ),
//     { AA: { rate: 0, tunnels: ["KH", "EJ", "OM", "TY", "DO"] } }
//   );
// });

// Deno.test("Extract data", () => {
//   const result = extractData(input);
//   assertEquals(result["JJ"], { rate: 21, tunnels: ["II"] });
//   assertEquals(result["EE"], { rate: 3, tunnels: ["FF", "DD"] });
//   assertEquals(result["AA"], { rate: 0, tunnels: ["DD", "II", "BB"] });
// });

Deno.test("Phase 1", () => {
  assertEquals(phase1(input), 1651);
});

// Deno.test("Phase 2", () => {
//   assertEquals(phase2(input), "");
// });
