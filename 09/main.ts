import { assert } from "console";
import { syncReadFile } from "../utils/utils";

export const parseLine = (inputLine: string): number[] => {
  return inputLine
    .split(" ")
    .map((x) => parseInt(x))
    .filter((x) => !Number.isNaN(x));
};

export function generateDifferenceSequence(input: number[]): number[] {
  const result: number[] = [];

  for (let i = 1; i < input.length; i++) {
    result.push(input[i] - input[i - 1]);
  }

  assert(result.length === input.length - 1);
  return result;
}

export function isAllZeroes(input: number[]): boolean {
  for (let i = 0; i < input.length; i++) {
    if (input[i] !== 0) {
      return false;
    }
  }
  return true;
}

export function calculateDifferenceSeries(inputNumbers: number[]): number[][] {
  let differenceSequence: number[][] = [inputNumbers];

  while (!isAllZeroes(differenceSequence.at(-1)!)) {
    const newDifferenceSequence: number[] = generateDifferenceSequence(
      differenceSequence.at(-1)!
    );

    differenceSequence.push(newDifferenceSequence);
  }
  return differenceSequence;
}

export function calculateNextPrevision(differenceSeries: number[][]): number {
  differenceSeries.at(-1)!.push(0);
  for (let i = differenceSeries.length - 2; i >= 0; i--) {
    const prevision =
      differenceSeries[i].at(-1)! + differenceSeries[i + 1].at(-1)!;

    differenceSeries[i].push(prevision);
  }
  return differenceSeries.at(0)!.at(-1)!;
}

function firstPuzzleResolver(fileInput: string) {
  const inputLines: string[] = syncReadFile(fileInput);

  let result: number = 0;
  for (let line of inputLines) {
    const nextPrevision = calculateNextPrevision(
      calculateDifferenceSeries(parseLine(line))
    );
    result += nextPrevision;
  }
  console.log("09: first puzzle: ", result);
}

export function calculateBackwards(differenceSeries: number[][]): number {
  differenceSeries.at(-1)!.unshift(0);
  for (let i = differenceSeries.length - 2; i >= 0; i--) {
    const prevision =
      differenceSeries[i].at(0)! - differenceSeries[i + 1].at(0)!;

    differenceSeries[i].unshift(prevision);
  }
  return differenceSeries.at(0)!.at(0)!;
}

function secondPuzzleResolver(fileInput: string) {
  const inputLines: string[] = syncReadFile(fileInput);

  let result: number = 0;
  for (let line of inputLines) {
    const nextPrevision = calculateBackwards(
      calculateDifferenceSeries(parseLine(line))
    );
    result += nextPrevision;
  }
  console.log("09: first puzzle: ", result);
}

firstPuzzleResolver("./09/input.txt");
secondPuzzleResolver("./09/input.txt");
