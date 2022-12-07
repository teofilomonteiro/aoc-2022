export function unique(input: string) {
  const letters = input.split("");
  const set = new Set();
  for (const letter of letters) {
    set.add(letter);
  }

  return letters.length === set.size;
}

export function phase1(input: string) {
  for (let i = 0; i < input.length - 4; i++) {
    if (unique(input.substring(i, i + 4))) {
      return i + 4;
    }
  }
  throw new Error("COULDN'T Detect");
}

export function phase2(input: string) {
  const leng = 14;
  for (let i = 0; i < input.length - leng; i++) {
    if (unique(input.substring(i, i + leng))) {
      return i + leng;
    }
  }
  throw new Error("COULDN'T Detect");
}
