import { flipMatrix, syncReadFile } from "../utils/utils";



export function encodeRow(row: string): number[] {
  let counterLastSeen = 0;
  let lastSeen: string = row[0];
  let encoded = [row[0] === "#" ? 1 : 0];
  for (let [index, char] of row.split("").entries()) {
    if (lastSeen === char) {
      counterLastSeen++;
    } else {
      encoded.push(counterLastSeen);
      counterLastSeen = 1;
    }
    if (index === row.length - 1) {
      encoded.push(counterLastSeen);
    }
    lastSeen = char;
  }
  return encoded;
}

export function encodeMatrix(matrix: string[]): number[][] {
  return matrix.map(encodeRow);
}

export function compareRows(row1: number[], row2: number[]): boolean {
  return (
    row1.length === row2.length &&
    row1.every((value, index) => value === row2[index])
  );
}

export function verifyMirror(
  mirrorCandidate: number,
  matrix: number[][],
  offset: number = 1
): boolean {
  const index1 = mirrorCandidate - offset + 1;
  const index2 = mirrorCandidate + offset;
  // case base: rows to compare are over (in one of the two directions)
  if (index1 === -1 || index2 === matrix.length) {
    return true;
  }
  // case base: rows are not equal
  if (!compareRows(matrix[index1], matrix[index2])) {
    return false;
  }
  // recursive case: rows are equal but there are more rows to compare
  return verifyMirror(mirrorCandidate, matrix, offset + 1);
}

export class Solver {
  encodedMatrix: number[][];
  flippedEncodedMatrix: number[][];

  constructor(private matrix: string[]) {
    this.encodedMatrix = encodeMatrix(matrix);
    this.flippedEncodedMatrix = encodeMatrix(flipMatrix(matrix));
  }

  findMirror(): number {
    // find mirror on rows
    for (let index = 0; index < this.encodedMatrix.length - 1; index++) {
      if (verifyMirror(index, this.encodedMatrix, 1)) {
        return 100 * (index + 1);
      }
    }
    // find mirror on columns
    for (let index = 0; index < this.flippedEncodedMatrix.length - 1; index++) {
      if (verifyMirror(index, this.flippedEncodedMatrix, 1)) {
        return index + 1;
      }
    }
    throw new Error("No mirror found");
  }
}

function firstPuzzleSolver(filePath: string) {
  const inputLines: string[] = syncReadFile(filePath);
  let buffer: string[] = [];
  let result = 0;
  for (let line of inputLines) {
    if (line !== "") {
      buffer.push(line);
    } else {
      const solver = new Solver(buffer);
      result += solver.findMirror();
      buffer = [];
    }
  }
  console.log("First puzzle: ", result);
}

export function encodeRowBinary(row: string): number[] {
  return row.split("").map((char) => (char === "#" ? 1 : 0));
}

export function encodeMatrixBinary(matrix: string[]): number[][] {
  return matrix.map(encodeRowBinary);
}

export function compareRowsBinary(row1: number[], row2: number[]): number {
  return row1
    .map((value, index) => (value === row2[index] ? 0 : 1))
    .reduce((acc: number, curr: number) => acc + curr, 0);
}

export function verifyMirrorSmudge(
  mirrorCandidate: number,
  matrix: number[][],
  offset: number,
  differences: number = 0
): number {
  const index1 = mirrorCandidate - offset + 1;
  const index2 = mirrorCandidate + offset;
  // case base: rows to compare are over (in one of the two directions)
  if (index1 === -1 || index2 === matrix.length) {
    return differences!;
  }
  const currentDifferences = compareRowsBinary(matrix[index1], matrix[index2]);
  // case base: rows are too different
  if (currentDifferences > 1) {
    return currentDifferences;
  }
  // recursive case: rows are still almost equal, but there are more rows to compare
  return verifyMirrorSmudge(
    mirrorCandidate,
    matrix,
    offset + 1,
    differences! + currentDifferences
  );
}

export class SolverSmudge {
  encodedMatrix: number[][];
  flippedEncodedMatrix: number[][];

  constructor(private matrix: string[]) {
    this.encodedMatrix = encodeMatrixBinary(matrix);
    this.flippedEncodedMatrix = encodeMatrixBinary(flipMatrix(matrix));
  }

  findMirrorSmudge(): number {
    // find mirror on rows
    for (let index = 0; index < this.encodedMatrix.length - 1; index++) {
      if (verifyMirrorSmudge(index, this.encodedMatrix, 1) === 1) {
        return 100 * (index + 1);
      }
    }
    // find mirror on columns
    for (let index = 0; index < this.flippedEncodedMatrix.length - 1; index++) {
      if (verifyMirrorSmudge(index, this.flippedEncodedMatrix, 1) === 1) {
        return index + 1;
      }
    }
    throw new Error("No mirror found");
  }
}

function secondPuzzleSolver(filePath: string) {
  const inputLines: string[] = syncReadFile(filePath);
  let buffer: string[] = [];
  let result = 0;
  for (let line of inputLines) {
    if (line !== "") {
      buffer.push(line);
    } else {
      const solver = new SolverSmudge(buffer);
      result += solver.findMirrorSmudge();
      buffer = [];
    }
  }
  console.log("Second puzzle: ", result);
}

firstPuzzleSolver("13/input.txt");
secondPuzzleSolver("13/input.txt");
