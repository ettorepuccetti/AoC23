import { processFile } from "../utils/utils.js";

function extractNumber(line: string, position: number) {
  return line
    .split(": ")[1]
    .split(" | ")
    [position].trim()
    .split(" ")
    .map((s: string) => {
      return parseInt(s);
    })
    .filter((n) => !Number.isNaN(n));
}

function firstPuzzleSolver(line: string): number {
  let result: number = 0;
  const winningNumbers: number[] = extractNumber(line, 0);
  const playedNumbers: number[] = extractNumber(line, 1);

  playedNumbers.forEach((played) => {
    if (winningNumbers.indexOf(played) !== -1) {
      result = result === 0 ? 1 : result * 2;
    }
  });

  return result;
}

processFile("04/input.txt", firstPuzzleSolver, undefined);
