import { createReadStream } from "fs";
import { createInterface } from "readline";
import { processFile } from "../utils/utils";

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

export interface CardInfo {
  winningNumbers: number;
  replicas: number;
}

export interface CardInfoStore {
  [key: number]: CardInfo;
}

export function getCardNumber(line: string): number {
  return parseInt(line.split(":")[0].split(" ").at(-1)!);
}

export function processLine(line: string): CardInfo {
  const result: CardInfo = { replicas: 1, winningNumbers: 0 };

  const winningNumbers: number[] = extractNumbers(line, "winning");
  const playedNumbers: number[] = extractNumbers(line, "played");

  playedNumbers.forEach((played) => {
    if (winningNumbers.indexOf(played) !== -1) {
      result.winningNumbers++;
    }
  });

  return result;
}

export function updateReplicas(state: CardInfoStore, cardNumber: number): void {
  const numberToAdd = state[cardNumber].replicas;
  const numberOfCardsToUpdate = state[cardNumber].winningNumbers;
  for (let i = 1; i <= numberOfCardsToUpdate; i++) {
    if (state[cardNumber + i] === undefined) {
      continue;
    }
    state[cardNumber + i].replicas += numberToAdd;
  }
}

async function secondPuzzleSolver(filePath: string) {
  const fileStream = createReadStream(filePath);

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let internalState: CardInfoStore = [];

  // build the state with no info on the replicas
  for await (const line of rl) {
    const cardNumber = getCardNumber(line);
    internalState[cardNumber] = processLine(line);
  }

  // update the replicas
  for (let cardNumber of Object.keys(internalState)) {
    updateReplicas(internalState, parseInt(cardNumber));
  }

  const result = Object.values(internalState).reduce<number>((partialSum: number, cardInfo) => {
    return partialSum + cardInfo.replicas;
  }, 0);
  console.log("second puzzle: ", result);
}

secondPuzzleSolver("04/input.txt");
processFile("04/input.txt", firstPuzzleSolver, undefined);
