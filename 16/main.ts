import { syncReadFile } from "../utils/utils";

export enum Direction {
  North,
  East,
  South,
  West,
}

export function reflect(
  piece: string,
  direction: Direction
): [Direction, Direction] | [Direction] {
  if (
    piece === "|" &&
    (direction === Direction.North || direction === Direction.South)
  ) {
    return [direction];
  }

  if (
    piece === "|" &&
    (direction === Direction.East || direction === Direction.West)
  ) {
    return [Direction.North, Direction.South];
  }

  if (
    piece === "-" &&
    (direction === Direction.East || direction === Direction.West)
  ) {
    return [direction];
  }

  if (
    piece === "-" &&
    (direction === Direction.North || direction === Direction.South)
  ) {
    return [Direction.East, Direction.West];
  }

  if (piece === "/") {
    if (direction === Direction.North) {
      return [Direction.East];
    }
    if (direction === Direction.East) {
      return [Direction.North];
    }
    if (direction === Direction.South) {
      return [Direction.West];
    }
    if (direction === Direction.West) {
      return [Direction.South];
    }
  }

  if (piece === "\\") {
    if (direction === Direction.North) {
      return [Direction.West];
    }
    if (direction === Direction.East) {
      return [Direction.South];
    }
    if (direction === Direction.South) {
      return [Direction.East];
    }
    if (direction === Direction.West) {
      return [Direction.North];
    }
  }
  if (piece === ".") {
    return [direction];
  }
  throw new Error(
    `Invalid piece or direction. piece:${piece}, direction ${Direction[direction]} `
  );
}

export function proceed(
  i: number,
  j: number,
  direction: Direction
): [number, number] {
  if (direction === Direction.North) {
    return [i - 1, j];
  }
  if (direction === Direction.East) {
    return [i, j + 1];
  }
  if (direction === Direction.South) {
    return [i + 1, j];
  }
  if (direction === Direction.West) {
    return [i, j - 1];
  }
  throw new Error(`Invalid direction ${Direction[direction]}`);
}

export class LightBeam {
  map: readonly string[][];
  alreadyVisited: boolean[][] = [];
  exitedNorth: Set<number> = new Set();
  exitedSouth: Set<number> = new Set();
  exitedWest: Set<number> = new Set();
  exitedEast: Set<number> = new Set();
  maxVisited: number = 0;

  constructor(inputLines: string[]) {
    this.map = inputLines.map((line) => line.split(""));
    for (let line of this.map) {
      this.alreadyVisited.push(new Array(line.length).fill(false));
    }
  }

  resetVisited() {
    for (let line of this.alreadyVisited) {
      line.fill(false);
    }
    // this.exitedNorth.clear();
    // this.exitedSouth.clear();
    // this.exitedWest.clear();
    // this.exitedEast.clear();
  }

  loopCheck(i: number, j: number): boolean {
    if (["|", "-"].includes(this.map[i][j])) {
      if (this.alreadyVisited[i][j]) {
        return true;
      }
      this.alreadyVisited[i][j] = true;
    }
    return false;
  }

  outsideBoundaries(i: number, j: number): boolean {
    if (i < 0) {
      this.exitedNorth.add(j);
      return true;
    }
    if (j < 0) {
      this.exitedWest.add(i);
      return true;
    }
    if (i >= this.map.length) {
      this.exitedSouth.add(j);
      return true;
    }
    if (j >= this.map[i].length) {
      this.exitedEast.add(i);
      return true;
    }
    return false;
  }

  buildPath(iStart: number, jStart: number, startDirection: Direction): void {
    let i = iStart;
    let j = jStart;
    let direction = startDirection;

    while (true) {
      [i, j] = proceed(i, j, direction);

      if (this.outsideBoundaries(i, j)) {
        break;
      }

      if (this.loopCheck(i, j)) {
        break;
      }

      this.alreadyVisited[i][j] = true;

      const newDirections: Direction[] = reflect(this.map[i][j], direction);

      if (newDirections.length === 2) {
        for (let newDirection of newDirections) {
          this.buildPath(i, j, newDirection);
        }
        break;
      } else {
        direction = newDirections[0];
      }
    }
  }

  countAlreadyVisited(): number {
    let count = 0;
    for (let line of this.alreadyVisited) {
      for (let cell of line) {
        if (cell) {
          count++;
        }
      }
    }
    return count;
  }

  printMap() {
    console.log("\n");
    this.alreadyVisited.forEach((line) =>
      console.log(line.map((cell) => (cell ? "#" : ".")).join(""))
    );
  }

  foundMaxVisited(): void {
    //entering west side
    for (let i = 0; i < this.map.length; i++) {
      if (this.exitedWest.has(i)) {
        continue;
      }
      this.buildPath(i, -1, Direction.East);
      this.maxVisited = Math.max(this.maxVisited, this.countAlreadyVisited());
      this.resetVisited();
    }

    //entering north side
    for (let j = 0; j < this.map[0].length; j++) {
      if (this.exitedNorth.has(j)) {
        continue;
      }
      this.buildPath(-1, j, Direction.South);
      this.maxVisited = Math.max(this.maxVisited, this.countAlreadyVisited());
      this.resetVisited();
    }

    //entering east side
    for (let i = 0; i < this.map.length; i++) {
      if (this.exitedEast.has(i)) {
        continue;
      }
      this.buildPath(i, this.map[i].length, Direction.West);
      this.maxVisited = Math.max(this.maxVisited, this.countAlreadyVisited());
      this.resetVisited();
    }

    //entering south side
    for (let j = 0; j < this.map[0].length; j++) {
      if (this.exitedSouth.has(j)) {
        continue;
      }
      this.buildPath(this.map.length, j, Direction.North);
      this.maxVisited = Math.max(this.maxVisited, this.countAlreadyVisited());
      this.resetVisited();
    }
  }
}

function firstPuzzleResolver(filePath: string) {
  const inputLines = syncReadFile(filePath);
  const lightbeam = new LightBeam(inputLines);
  lightbeam.buildPath(0, -1, Direction.East);
  console.log("First puzzle: ", lightbeam.countAlreadyVisited());
}

function secondPuzzleResolver(filePath: string) {
  const inputLines = syncReadFile(filePath);
  const lightbeam = new LightBeam(inputLines);
  lightbeam.foundMaxVisited();
  console.log("Second puzzle: ", lightbeam.maxVisited);
}

firstPuzzleResolver("16/input.txt");
secondPuzzleResolver("16/input.txt");
