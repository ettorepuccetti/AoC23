import { createReadStream } from "fs";
import { createInterface } from "readline";

export async function processFile(
  filePath: string,
  callBackFirstPuzzle: (line: string, index?: number) => number,
  callBackSecondPuzzle: (line: string) => number
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
  console.log("first puzzle: ", firstResult);
  console.log("second puzzle: ", secondResult);
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
