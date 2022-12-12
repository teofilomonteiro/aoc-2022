export function sum(array: number[]) {
  return array.reduce((partialSum, a) => partialSum + a, 0);
}
export function multiply(array: number[]) {
  return array.reduce((partialSum, a) => partialSum * a, 1);
}
