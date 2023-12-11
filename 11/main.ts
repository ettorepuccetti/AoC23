import assert from "assert";
import {
  multiplyByScalarMatrix,
  sumMatrices,
  syncReadFile,
} from "../utils/utils";

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

function buildMatrix(
  galaxyMatrix: number[][],
  distanceFunction: (
    g1: number[],
    g2: number[],
    auxArr1?: number[],
    auxArr2?: number[]
  ) => number,
  auxArr1?: number[],
  auxArr2?: number[]
) {
  const matrix: number[][] = [];

  // preallocate matrix
  for (let [galaxyIndex, galaxy] of galaxyMatrix.entries()) {
    matrix[galaxyIndex] = [];
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
      const distance = distanceFunction(galaxy, neighbour, auxArr1, auxArr2);
      matrix[galaxyIndex][neighbourIndex] = distance;
      matrix[neighbourIndex][galaxyIndex] = distance;
    }
  }

  return matrix;
}

export function buildDistanceMatrix(galaxyMatrix: number[][]): number[][] {
  return buildMatrix(galaxyMatrix, calculateDistance);
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

export const calculateRowAndColumnInBetween = (
  g1: number[],
  g2: number[],
  emptyRowIndexes?: number[],
  emptyColumnIndexes?: number[]
): number => {
  let result = 0;

  const [galaxySmallerRow, galaxyGratherRow] =
    g1[0] < g2[0] ? [g1, g2] : [g2, g1];
  const [galaxySmallerColumn, galaxyGratherColumn] =
    g1[1] < g2[1] ? [g1, g2] : [g2, g1];

  for (let i = galaxySmallerRow[0] + 1; i < galaxyGratherRow[0]; i++) {
    if (emptyRowIndexes!.includes(i)) {
      result++;
    }
  }

  for (let i = galaxySmallerColumn[1] + 1; i < galaxyGratherColumn[1]; i++) {
    if (emptyColumnIndexes!.includes(i)) {
      result++;
    }
  }

  return result;
};

export function buildEmptyRowColumnMatrix(
  galaxyMatrix: number[][],
  inputLines: string[]
) {
  return buildMatrix(
    galaxyMatrix,
    calculateRowAndColumnInBetween,
    findEmptyRow(inputLines),
    findEmptyColumn(inputLines)
  );
}

function secondPuzzleResolver(inputFile: string) {
  let inputLines = syncReadFile(inputFile);
  const SCALAR_FACTOR = 999999;

  // find galaxies and distances
  const galaxyMatrix = buildGalaxyMatrix(inputLines);
  const distanceMatrix = buildDistanceMatrix(galaxyMatrix);
  const emptyRowColumnsMatrix = buildEmptyRowColumnMatrix(
    galaxyMatrix,
    inputLines
  );

  const distanceWithExpansionsMatrix = sumMatrices(
    distanceMatrix,
    multiplyByScalarMatrix(emptyRowColumnsMatrix, SCALAR_FACTOR)
  );

  //sum all the distances
  const sum = sumDistances(distanceWithExpansionsMatrix);

  console.log("11: Second puzzle: ", sum);
}

firstPuzzleResolver("11/input.txt");
secondPuzzleResolver("11/input.txt");
