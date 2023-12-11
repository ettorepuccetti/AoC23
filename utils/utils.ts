import { assert } from "console";
import { createReadStream, readFileSync } from "fs";
import { createInterface } from "readline";

export async function processFile(
  filePath: string,
  callBackFirstPuzzle?: (line: string) => number,
  callBackSecondPuzzle?: (line: string) => number
) {
  const fileStream = createReadStream(filePath);

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let firstResult = 0;
  let secondResult = 0;

  for await (const line of rl) {
    firstResult =
      firstResult + (callBackFirstPuzzle ? callBackFirstPuzzle(line) : 0);
    secondResult =
      secondResult + (callBackSecondPuzzle ? callBackSecondPuzzle(line) : 0);
  }
  callBackFirstPuzzle && console.log("first puzzle: ", firstResult);
  callBackSecondPuzzle && console.log("second puzzle: ", secondResult);
}

export async function processFileThreeLinesAtTime(
  filePath: string,
  callBack: (
    prevLine: string | undefined,
    currentLine: string | undefined,
    nextLine: string | undefined
  ) => number
) {
  const fileStream = createReadStream(filePath);

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let prevLine: string | undefined = undefined;
  let currentLine: string | undefined = undefined;
  let nextLine: string | undefined = undefined;

  let result = 0;

  for await (const line of rl) {
    prevLine = currentLine;
    currentLine = nextLine;
    nextLine = line;

    result += callBack(prevLine, currentLine, nextLine);
  }

  // last line must be processed outside the loop
  prevLine = currentLine;
  currentLine = nextLine;
  nextLine = undefined;
  result += callBack(prevLine, currentLine, nextLine);

  console.log("result: ", result);
}

export function syncReadFile(filename: string): string[] {
  const contents = readFileSync(filename, "utf-8");
  const arr = contents.split(/\r?\n/);
  return arr;
}

export function sumMatrices(matrix1: number[][], matrix2: number[][]) {
  assert(matrix1.length === matrix2.length);
  const result: number[][] = [];
  for (let i = 0; i < matrix1.length; i++) {
    assert(matrix1[i].length === matrix2[i].length);
    result[i] = [];
    for (let j = 0; j < matrix1.length; j++) {
      result[i][j] = matrix1[i][j] + matrix2[i][j];
    }
  }
  return result;
}

export function multiplyByScalarMatrix(matrix: number[][], scalar: number) {
  const result: number[][] = [];
  for (let i = 0; i < matrix.length; i++) {
    result[i] = [];
    for (let j = 0; j < matrix[i].length; j++) {
      result[i][j] = matrix[i][j] * scalar;
    }
  }
  return result;
}
