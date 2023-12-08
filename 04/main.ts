import { createReadStream } from "fs";
import { createInterface } from "readline";
import { processFile } from "../utils/utils.js";

type positionType = "winning" | "played";

function extractNumbers(line: string, position: positionType) {
  const index = position === "winning" ? 0 : 1;
  return line
    .split(": ")[1]
    .split(" | ")
    [index].trim()
    .split(" ")
    .map((s: string) => {
      return parseInt(s);
    })
    .filter((n) => !Number.isNaN(n));
}

function firstPuzzleSolver(line: string): number {
  let result: number = 0;
  const winningNumbers: number[] = extractNumbers(line, "winning");
  const playedNumbers: number[] = extractNumbers(line, "played");

  playedNumbers.forEach((played) => {
    if (winningNumbers.indexOf(played) !== -1) {
      result = result === 0 ? 1 : result * 2;
    }
  });

  return result;
}

interface CardInfo {
  winningNumbers: number;
  replicas: number;
}

interface CardInfoStore {
  [key: number]: CardInfo;
}

async function secondPuzzleSolver(filePath: string): Promise<number> {
  const fileStream = createReadStream(filePath);

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let result = 0;
  let internalState: CardInfoStore = [];
  for await (const line of rl) {
    internalState = processLine(line, internalState);
  }
  return 0;
}

export function getCardNumber(line: string): number {
  return parseInt(line.split(":")[1].trim().split(" ")[1]);
}

function processLine(
  line: string,
  internalState: CardInfoStore
): CardInfoStore {
  const newInternalState: CardInfoStore = [];

  const cardNumber = getCardNumber(line);

  const winningNumbers: number[] = extractNumbers(line, "winning");
  const playedNumbers: number[] = extractNumbers(line, "played");

  // playedNumbers.forEach((played) => {
  //   if (winningNumbers.indexOf(played) !== -1) {
  //     internalState;
  //   }
  // });

  return newInternalState;
}

secondPuzzleSolver("04/input.toy.txt");
processFile("04/input.txt", firstPuzzleSolver, undefined);
