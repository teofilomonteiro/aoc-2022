type Instruction = {
  move: number;
  from: number;
  to: number;
};

type Containers = string[][];

export function getContainers(input: string): Containers {
  const lines = input
    .split("\n")
    .reverse()
    .filter((line) => !line.match(/[0-9]+/))
    .map((line) => line.match(/.{1,4}/g) as string[]);

  const stacks: string[][] = [];

  for (const line of lines) {
    line.forEach((value, index) => {
      const name = value.match(/[a-zA-Z]/)?.toString();

      if (name) {
        if (!stacks[index]) {
          stacks[index] = [name];
        } else {
          stacks[index].push(name);
        }
      }
    });
  }
  return stacks;
}

export function parseInstructions(line: string): Instruction {
  const parsed = line.match(/move (\d+) from (\d+) to (\d+)/);

  if (!parsed) {
    throw new Error("can't parse instruction");
  }
  return {
    move: Number(parsed[1]),
    from: Number(parsed[2]),
    to: Number(parsed[3]),
  };
}

export function moveContainers(
  containers: Containers,
  instruction: Instruction,
  notReverse?: boolean
) {
  const from = containers[instruction.from - 1];

  const removePosition = from.length - instruction.move;
  const movingContainers = from.slice(removePosition);

  if (!notReverse) {
    movingContainers.reverse();
  }
  containers[instruction.from - 1] = from.slice(0, removePosition);
  containers[instruction.to - 1].push(...movingContainers);
  return containers;
}

export function phase1(containers: Containers, instructions: string) {
  let state = containers;
  instructions.split("\n").forEach((line) => {
    const instruction = parseInstructions(line);
    state = moveContainers(state, instruction);
  });

  return state.map((stack) => stack.pop()).join("");
}

export function phase2(containers: Containers, instructions: string) {
  let state = containers;
  instructions.split("\n").forEach((line) => {
    const instruction = parseInstructions(line);
    state = moveContainers(state, instruction, true);
  });

  return state.map((stack) => stack.pop()).join("");
}
