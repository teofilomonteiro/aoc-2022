import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { extractData, toSNAFU, fromSNAFU, phase1, phase2 } from "./lib.ts";

const input = `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`;

Deno.test("Extract data", () => {
  assertEquals(extractData(input), [
    "1=-0-2",
    "12111",
    "2=0=",
    "21",
    "2=01",
    "111",
    "20012",
    "112",
    "1=-1=",
    "1-12",
    "12",
    "1=",
    "122",
  ]);
});

Deno.test("From SNAFU", async (t) => {
  await t.step("transform 1", () => {
    assertEquals(fromSNAFU("1"), 1);
  });

  await t.step("transform 2", () => {
    assertEquals(fromSNAFU("2"), 2);
  });

  await t.step("transform 1=", () => {
    assertEquals(fromSNAFU("1="), 3);
  });
  await t.step("transform 1-", () => {
    assertEquals(fromSNAFU("1-"), 4);
  });

  await t.step("transform 10", () => {
    assertEquals(fromSNAFU("10"), 5);
  });
  await t.step("transform 1121-1110-1=0", () => {
    assertEquals(fromSNAFU("1121-1110-1=0"), 314159265);
  });
});

Deno.test("to SNAFU", async (t) => {
  await t.step("transform 1", () => {
    assertEquals(toSNAFU(1), "1");
  });

  await t.step("transform 2", () => {
    assertEquals(toSNAFU(2), "2");
  });

  await t.step("transform 1=", () => {
    assertEquals(toSNAFU(3), "1=");
  });
  await t.step("transform 1-", () => {
    assertEquals(toSNAFU(4), "1-");
  });

  await t.step("transform 10", () => {
    assertEquals(toSNAFU(5), "10");
  });

  await t.step("transform 10", () => {
    assertEquals(toSNAFU(10), "20");
  });

  await t.step("transform 15", () => {
    assertEquals(toSNAFU(15), "1=0");
  });
  await t.step("transform 16", () => {
    assertEquals(toSNAFU(16), "1=1");
  });

  await t.step("transform 18", () => {
    assertEquals(toSNAFU(20), "1-0");
  });

  await t.step("transform 22", () => {
    assertEquals(toSNAFU(22), "1-2");
  });

  await t.step("transform 24", () => {
    assertEquals(toSNAFU(24), "10-");
  });

  await t.step("transform 314159265", () => {
    assertEquals(toSNAFU(314159265), "1121-1110-1=0");
  });
});

Deno.test("Phase 1", () => {
  assertEquals(phase1(input), "2=-1=0");
});

Deno.test("Phase 2", () => {
  assertEquals(phase2(input), "");
});
