import { processFile } from "../utils/utils.js";

async function main(filePath: string) {
  processFile(filePath, firstPuzzleSolver, secondPuzzleSolver);
}

const MAX_N_OF_RED = 12;
const MAX_N_OF_GREEN = 13;
const MAX_N_OF_BLUE = 14;

type Extraction = { red: number; green: number; blue: number };

function getGameId(line: string) {
  return parseInt(line.split(":")[0].split(" ")[1]);
}

function getSets(line: string): string[] {
  return line.split(": ")[1].split("; ");
}

function extractNumberFromSet(currentSet: string): Extraction {
  const result: { [key: string]: number } = { red: 0, blue: 0, green: 0 };
  const observations: string[] = currentSet.split(", ");
  for (let obs of observations) {
    const color = obs.split(" ")[1];
    result[color] = parseInt(obs.split(" ")[0]);
  }
  return result as Extraction;
}

function isValidObservation(cubeExtracted: Extraction): boolean {
  return (
    cubeExtracted.red <= MAX_N_OF_RED &&
    cubeExtracted.green <= MAX_N_OF_GREEN &&
    cubeExtracted.blue <= MAX_N_OF_BLUE
  );
}

function firstPuzzleSolver(line: string) {
  const sets: string[] = getSets(line);
  let stillPlayable: boolean = true;
  let i: number = 0;
  while (stillPlayable && i < sets.length) {
    const currentSet: string = sets[i];
    const cubeExtracted: Extraction = extractNumberFromSet(currentSet);

    if (!isValidObservation(cubeExtracted)) {
      stillPlayable = false;
    }

    i++;
  }
  return stillPlayable ? getGameId(line) : 0;
}

function secondPuzzleSolver(line: string) {
  const sets: string[] = getSets(line);
  const minCubes: Extraction = { red: 0, blue: 0, green: 0 };
  for (let set of sets) {
    const extracted: Extraction = extractNumberFromSet(set);
    minCubes.red = extracted.red > minCubes.red ? extracted.red : minCubes.red;
    minCubes.green =
      extracted.green > minCubes.green ? extracted.green : minCubes.green;
    minCubes.blue =
      extracted.blue > minCubes.blue ? extracted.blue : minCubes.blue;
  }
  return minCubes.red * minCubes.blue * minCubes.green;
}

main("02/input.txt");
