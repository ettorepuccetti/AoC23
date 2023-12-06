import { processFileThreeLinesAtTime } from "../utils/utils.js";

type StartEndIndex = { start: number; end: number };

function findSimbolsIndexes(
  line: string | undefined,
  simbolToFind?: string
): number[] {
  const indexes: number[] = [];

  if (!line) return indexes;

  const isASimbol = (char: string) => {
    return simbolToFind
      ? char === simbolToFind
      : char !== "." && Number.isNaN(parseInt(char));
  };

  [...line].forEach((char, index) => {
    if (isASimbol(char)) {
      indexes.push(index);
    }
  });
  return indexes;
}

const isNumber = (char: string) => {
  return char !== "." && !Number.isNaN(parseInt(char));
};

/**
 * Convert an input string in an array containg the information about where all its numbers start and end
 * @param line string represent a whole input line
 * @returns an array containg all the `{startIndex, endIndex}` of the numbers in the input string
 * @example `..$.23..4.#.` -> [{4,6}, {9,10}]
 */
function findNumberIndexes(line: string | undefined): StartEndIndex[] {
  const result: StartEndIndex[] = [];

  if (!line) {
    return result;
  }

  let startedParsing: boolean = false;
  let aux: StartEndIndex = { start: Number.NaN, end: Number.NaN };

  const arrayOfChars = [...line];
  arrayOfChars.forEach((char, index) => {
    if (isNumber(char)) {
      if (startedParsing) {
        if (index === arrayOfChars.length - 1) {
          aux.end = index;
          result.push({ start: aux.start, end: aux.end + 1 });
        }
      } else {
        startedParsing = true;
        aux.start = index;
      }
    } else {
      if (!startedParsing) {
        return;
      } else {
        startedParsing = false;
        aux.end = index;
        result.push({ start: aux.start, end: aux.end });
      }
    }
  });
  return result;
}

const isTouchingSimbol = (
  startEndIndex: StartEndIndex,
  simbolIndexes: number[]
): boolean => {
  for (let simbolIndex of simbolIndexes) {
    if (
      simbolIndex >= startEndIndex.start - 1 &&
      simbolIndex <= startEndIndex.end
    ) {
      return true;
    }
  }
  return false;
};

function firstPuzzleSolver(
  prevLine: string | undefined,
  currentLine: string | undefined,
  nextLine: string | undefined
) {
  let result = 0;
  if (currentLine === undefined) return result;

  const prevLineSimbolIndexes: number[] = findSimbolsIndexes(prevLine);
  const currLineLineSimbolIndexes: number[] = findSimbolsIndexes(currentLine);
  const nextLineSimbolIndexes: number[] = findSimbolsIndexes(nextLine);

  const startEndNumberIndexes: StartEndIndex[] = findNumberIndexes(currentLine);

  for (let startEndIndex of startEndNumberIndexes) {
    if (
      isTouchingSimbol(startEndIndex, prevLineSimbolIndexes) ||
      isTouchingSimbol(startEndIndex, currLineLineSimbolIndexes) ||
      isTouchingSimbol(startEndIndex, nextLineSimbolIndexes)
    ) {
      const numberToInclude = parseInt(
        currentLine.substring(startEndIndex.start, startEndIndex.end)
      );
      result += numberToInclude;
    }
  }

  return result;
}

function findAdjacentNumbers(
  starIndex: number,
  numberIndexes: StartEndIndex[],
  line: string | undefined
): number[] {
  const result: number[] = [];
  if (!line) return result;

  for (let numberIndex of numberIndexes) {
    if (numberIndex.start - 1 <= starIndex && starIndex <= numberIndex.end) {
      result.push(parseInt(line.substring(numberIndex.start, numberIndex.end)));
    }
  }

  return result;
}

function secondPuzzleSolver(
  prevLine: string | undefined,
  currentLine: string | undefined,
  nextLine: string | undefined
) {
  let result = 0;
  if (currentLine === undefined) return result;

  const starSimbolIndexes: number[] = findSimbolsIndexes(currentLine, "*");

  const prevLinesNumberIndexes = findNumberIndexes(prevLine);
  const currentLinesNumberIndexes = findNumberIndexes(currentLine);
  const nextLinesNumberIndexes = findNumberIndexes(nextLine);

  for (let starIndex of starSimbolIndexes) {
    let adjacentNumbers: number[] = [];

    adjacentNumbers = adjacentNumbers.concat(
      findAdjacentNumbers(starIndex, prevLinesNumberIndexes, prevLine)
    );
    adjacentNumbers = adjacentNumbers.concat(
      findAdjacentNumbers(starIndex, currentLinesNumberIndexes, currentLine)
    );
    adjacentNumbers = adjacentNumbers.concat(
      findAdjacentNumbers(starIndex, nextLinesNumberIndexes, nextLine)
    );

    if (adjacentNumbers.length == 2) {
      result += adjacentNumbers[0] * adjacentNumbers[1];
    }
  }
  return result;
}

processFileThreeLinesAtTime("03/input.txt", firstPuzzleSolver);
processFileThreeLinesAtTime("03/input.txt", secondPuzzleSolver);
