import { assert } from "console";
import { syncReadFile } from "../utils/utils";

function firstPuzzleResolver(filePath: string) {
  const line: string = syncReadFile(filePath)[0];
  let result = 0;
  for (let step of line.split(",")) {
    result += processString(step);
  }
  console.log("First puzzle: ", result);
}

export function processString(word: string) {
  let result = 0;
  for (let char of word) {
    result = processChar(char, result);
  }
  return result;
}

export function processChar(char: string, result: number) {
  assert(char.length === 1);
  let value = result + char.charCodeAt(0);
  value *= 17;
  value = value % 256;
  return value;
}

export function parseInstruction(
  instruction: string
): [string, number | undefined] {
  if (instruction.at(-2) === "=") {
    const focalLength = parseInt(instruction.slice(-1));
    assert(!Number.isNaN(focalLength));
    return [instruction.slice(0, -2), focalLength];
  }
  if (instruction.at(-1) === "-") {
    return [instruction.slice(0, -1), undefined];
  }
  throw new Error("Invalid instruction");
}

export class Box {
  lensToFocalLength: Map<string, number>;
  lensArray: string[];

  constructor() {
    this.lensToFocalLength = new Map();
    this.lensArray = [];
  }

  insertLens(lens: string, focalLength: number) {
    if (!this.lensToFocalLength.has(lens)) {
      this.lensArray.push(lens);
    }
    this.lensToFocalLength.set(lens, focalLength);
  }

  removeLens(lens: string) {
    this.lensArray = this.lensArray.filter((l) => l !== lens);
    this.lensToFocalLength.delete(lens);
  }

  calculateFocusingPower(boxIndex: number): number {
    let result = 0;
    for (let [index, lens] of this.lensArray.entries()) {
      result += boxIndex * (index + 1) * this.lensToFocalLength.get(lens)!;
    }
    return result;
  }
}

export class Solver {
  boxes: Map<number, Box> = new Map();

  insertNewLensInBox(lens: string, focalLength: number): void {
    const boxNumber = processString(lens);
    if (!this.boxes.has(boxNumber)) {
      this.boxes.set(boxNumber, new Box());
    }
    this.boxes.get(boxNumber)!.insertLens(lens, focalLength);
  }

  removeLensInBox(lens: string): void {
    const boxNumber = processString(lens);
    if (!this.boxes.has(boxNumber)) {
      return;
    }
    this.boxes.get(boxNumber)!.removeLens(lens);
  }

  calculateFocusingPower(): number {
    let result = 0;
    for (let [index, box] of this.boxes.entries()) {
      result += box.calculateFocusingPower(index + 1);
    }
    return result;
  }
}

function secondPuzzleResolver(filePath: string) {
  const line: string = syncReadFile(filePath)[0];
  let result = 0;
  const solver = new Solver();
  for (let step of line.split(",")) {
    const [lens, focalLength] = parseInstruction(step);
    if (focalLength) {
      solver.insertNewLensInBox(lens, focalLength);
    } else {
      solver.removeLensInBox(lens);
    }
  }
  console.log("Second puzzle: ", solver.calculateFocusingPower());
}

firstPuzzleResolver("15/input.txt");
secondPuzzleResolver("15/input.txt");
