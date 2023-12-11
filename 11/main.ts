import assert from "assert";
import { syncReadFile } from "../utils/utils";

export function buildGalaxyMatrix(inputLines: string[]): number[][] {
  const matrix: number[][] = [];
  for (let [index, line] of inputLines.entries()) {
    for (let [charIndex, char] of line.split("").entries()) {
      if (char === "#") {
        matrix.push([index, charIndex]);
      }
    }
  }
  return matrix;
}

export function calculateDistance(g1: number[], g2: number[]) {
  return Math.abs(g1[0] - g2[0]) + Math.abs(g1[1] - g2[1]);
}

export function buildDistanceMatrix(galaxyMatrix: number[][]) {
  const matrix: number[][] = [];

  // preallocate matrix
  for (let [galaxyIndex, galaxy] of galaxyMatrix.entries()) {
    matrix[galaxyIndex] = Array.from<number>({
      length: galaxyMatrix.length,
    });
  }

  // fill with the distances
  for (let [galaxyIndex, galaxy] of galaxyMatrix.entries()) {
    // diagonal
    matrix[galaxyIndex][galaxyIndex] = 0;
    for (
      let neighbourIndex = galaxyIndex + 1;
      neighbourIndex < galaxyMatrix.length;
      neighbourIndex++
    ) {
      const neighbour = galaxyMatrix[neighbourIndex];
      const distance = calculateDistance(galaxy, neighbour);
      matrix[galaxyIndex][neighbourIndex] = distance;
      matrix[neighbourIndex][galaxyIndex] = distance;
    }
  }

  return matrix;
}

export function findEmptyRow(inputLines: string[]): number[] {
  const emptyRow: number[] = [];
  for (let [index, line] of inputLines.entries()) {
    if (line.indexOf("#") === -1) {
      emptyRow.push(index);
    }
  }
  return emptyRow;
}

export function findEmptyColumn(inputLines: string[]): number[] {
  const emptyCol: number[] = [];

  for (let j = 0; j < inputLines[0].length; j++) {
    for (let i = 0; i < inputLines.length; i++) {
      if (inputLines[i][j] === "#") {
        break;
      }
      if (i === inputLines.length - 1) {
        emptyCol.push(j);
      }
    }
  }

  return emptyCol;
}

export function addEmptyColumn(
  inputLines: string[],
  columnIndex: number
): string[] {
  const newLines = inputLines.map((line) => {
    return line.slice(0, columnIndex) + "." + line.slice(columnIndex);
  });
  return newLines;
}

export function addEmptyRow(inputLines: string[], rowIndex: number): string[] {
  const newLines = [...inputLines]
    .slice(0, rowIndex)
    .concat([".".repeat(inputLines[0].length)], inputLines.slice(rowIndex));
  return newLines;
}

export function expandUniverse(inputLines: string[]): string[] {
  let expandedUniverse = [...inputLines];
  const emptyRowIndexes = findEmptyRow(expandedUniverse);
  const emptyColumnIndexes = findEmptyColumn(expandedUniverse);
  for (let [index, rowIndex] of emptyRowIndexes.entries()) {
    expandedUniverse = addEmptyRow(expandedUniverse, rowIndex + index);
  }
  for (let [index, columnIndex] of emptyColumnIndexes.entries()) {
    expandedUniverse = addEmptyColumn(expandedUniverse, columnIndex + index);
  }
  assert(
    buildGalaxyMatrix(expandedUniverse).length ===
      buildGalaxyMatrix(inputLines).length
  );
  return expandedUniverse;
}

export function sumDistances(distanceMatrix: number[][]): number {
  let sum = 0;
  for (let distanceRow of distanceMatrix) {
    sum += distanceRow.reduce((prev, current) => prev + current, 0);
  }
  return sum / 2;
}

function firstPuzzleResolver(inputFile: string) {
  let inputLines = syncReadFile(inputFile);

  //expand the universe
  const expandedUniverse = expandUniverse(inputLines);

  // find galaxies and distances
  const galaxyMatrix = buildGalaxyMatrix(expandedUniverse);
  const distanceMatrix = buildDistanceMatrix(galaxyMatrix);

  //sum all the distances
  const sum = sumDistances(distanceMatrix);

  console.log("11: First puzzle: ", sum);
}

firstPuzzleResolver("11/input.txt");

function secondPuzzleResolver(inputFile: string) {}
