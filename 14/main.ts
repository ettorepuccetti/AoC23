import {
  flipMatrix as flipMatrixClockwise,
  flipMatrixCounterClockwise,
  syncReadFile,
} from "../utils/utils";

export function firstPuzzleSolver(filePath: string) {
  const inputLines = syncReadFile(filePath).filter((line) => line.length > 0);
  const inputLinesFlipped = flipMatrixClockwise(inputLines);
  let result = 0;
  for (let line of inputLinesFlipped) {
    result += countRocksDistance(line);
  }
  console.log("First puzzle: ", result);
}

export function countRocksDistance(line: string): number {
  line = line + "#";
  let result = 0;
  let roundRocks = 0;

  for (let [index, char] of line.split("").entries()) {
    if (char === "O") {
      roundRocks++;
    }
    if (char === "#") {
      for (let i = 0; i < roundRocks; i++) {
        result += index - i;
      }
      roundRocks = 0;
    }
  }
  return result;
}

// firstPuzzleSolver("14/input.txt");

export function moveRocksRowToRight(line: string): string {
  line = line + "#";
  let roundRocks = 0;
  let result: string[] = Array(line.length).fill(".");

  for (let [index, char] of line.split("").entries()) {
    if (char === "O") {
      roundRocks++;
    }
    if (char === "#") {
      result[index] = "#";
      for (let i = 0; i < roundRocks; i++) {
        result[index - i - 1] = "O";
      }
      roundRocks = 0;
    }
  }
  return result.join("").slice(0, -1);
}

export function moveRocksRowtoLeft(line: string) {
  line = "#" + line;
  let roundRocks = 0;
  let result: string[] = Array(line.length).fill(".");
  for (let i = line.length - 1; i >= 0; i--) {
    if (line[i] === "O") {
      roundRocks++;
    }
    if (line[i] === "#") {
      result[i] = "#";
      for (let j = 0; j < roundRocks; j++) {
        result[i + j + 1] = "O";
      }
      roundRocks = 0;
    }
  }
  return result.join("").slice(1);
}

export class Solver {
  matrix: string[];
  loopLength: number = 0;
  loopStart: number = 0;
  constructor(input: string[]) {
    this.matrix = input;
  }

  tiltNorth() {
    const inputLinesFlipped = flipMatrixClockwise(this.matrix);
    const result = [];
    for (let line of inputLinesFlipped) {
      result.push(moveRocksRowToRight(line));
    }
    this.matrix = flipMatrixCounterClockwise(result);
    return this;
  }

  tiltWest() {
    const result = [];
    for (let line of this.matrix) {
      result.push(moveRocksRowtoLeft(line));
    }
    this.matrix = result;
    return this;
  }

  tiltSouth() {
    const inputLinesFlipped = flipMatrixClockwise(this.matrix);
    const result = [];
    for (let line of inputLinesFlipped) {
      result.push(moveRocksRowtoLeft(line));
    }
    this.matrix = flipMatrixCounterClockwise(result);
    return this;
  }

  tiltEast() {
    const result = [];
    for (let line of this.matrix) {
      result.push(moveRocksRowToRight(line));
    }
    this.matrix = result;
    return this;
  }

  spinCycle() {
    this.tiltNorth();
    this.tiltWest();
    this.tiltSouth();
    this.tiltEast();
    return this;
  }

  private findLoopStartAndLength() {
    let loopLength = 0;
    const seenStates: string[] = [];
    while (this.loopLength === 0) {
      loopLength++;
      this.spinCycle();
      if (seenStates.includes(JSON.stringify(this.matrix))) {
        this.loopStart = seenStates.indexOf(JSON.stringify(this.matrix));
        this.loopLength = loopLength + 1 - this.loopStart;
      } else {
        seenStates.push(JSON.stringify(this.matrix));
      }
    }
  }

  spinCyclesNTimesLoopDetection(n: number) {
    this.findLoopStartAndLength();
    const lastCyclesToDo = (n - this.loopStart) % this.loopLength;
    const actualCyclesTodo = this.loopStart + lastCyclesToDo;
    for (let i = 0; i < actualCyclesTodo; i++) {
      this.spinCycle();
    }
    return this;
  }

  calculateNorthBeamLoad() {
    let result = 0;
    for (let [index, line] of this.matrix.entries()) {
      for (let char of line) {
        if (char === "O") {
          result += this.matrix.length - index;
        }
      }
    }
    return result;
  }
}

function secondPuzzleSolver(fileInput: string) {
  const inputLines = syncReadFile(fileInput).filter((line) => line.length > 0);
  const solver = new Solver(inputLines);
  const ONE_BILION = 1000000000;
  solver.spinCyclesNTimesLoopDetection(ONE_BILION);
  console.log("Second puzzle: ", solver.calculateNorthBeamLoad());
}

secondPuzzleSolver("14/input.toy.txt");
