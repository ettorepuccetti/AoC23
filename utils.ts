import { createReadStream } from "fs";
import { createInterface } from "readline";

export async function processFile(
  filePath: string,
  callBackFirstPuzzle: (line: string, index? : number) => number | undefined,
  callBackSecondPuzzle: (line: string) => number | undefined
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
