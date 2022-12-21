type Data = number[];
type DataInfo = [number, number];

export function toPositions(data: Data): DataInfo[] {
  return data.map((value, index) => [value, index]);
}

export function extractData(input: string): Data {
  return input.split("\n").map(Number);
}

export function phase1(input: string) {
  const inputArray = extractData(input);
  const array = moveArray(inputArray);

  return findPositionFromZero(array);
}
function findPositionFromZero(array: number[]) {
  const zeroIndex = array.indexOf(0);

  return [1000, 2000, 3000].reduce((acc, value) => {
    return acc + array[(zeroIndex + value) % array.length];
  }, 0);
}

export function phase2(input: string) {
  let array = extractData(input);

  const dKey = 811589153;
  array = array.map((x) => x * dKey);
  const resultArray = moveArray(array, 10);
  return findPositionFromZero(resultArray);
}

export function moveElementInArray(element: DataInfo, array: DataInfo[]) {
  const [elemValue, elemIndex] = element;

  if (elemValue === 0) {
    return array;
  }

  const position = array.findIndex(
    ([value, index]) => value === elemValue && index == elemIndex
  );

  const result = [...array];

  result.splice(position, 1);

  const nextPosition = (position + elemValue) % result.length;

  if (nextPosition === 0) {
    result.push(element);
  } else {
    result.splice(nextPosition, 0, element);
  }

  return result;
}

export function moveArray(array: number[], times = 1): number[] {
  const reference = toPositions(array);
  let result = [...reference];

  const arrayLength = array.length;
  for (let time = 0; time < times; time++) {
    for (let i = 0; i < arrayLength; i++) {
      const element = reference[i];

      result = moveElementInArray(element, result);
    }
  }

  return result.map(([value]) => value);
}
