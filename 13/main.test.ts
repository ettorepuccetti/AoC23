import { flipMatrix } from "../utils/utils";
import {
  Solver,
  SolverSmudge,
  compareRows,
  compareRowsBinary,
  encodeMatrixBinary,
  encodeRow,
  verifyMirror,
  verifyMirrorSmudge,
} from "./main";
const input = [
  ".#..", //0
  "....", //1
  "####", //2
  "...#", //3
  "..##", //4
];

describe("13", () => {
  it("encodeRow", () => {
    expect(encodeRow(input[0])).toEqual([0, 1, 1, 2]);
    expect(encodeRow(input[1])).toEqual([0, 4]);
    expect(encodeRow(input[2])).toEqual([1, 4]);
    expect(encodeRow(input[3])).toEqual([0, 3, 1]);
    expect(encodeRow(input[4])).toEqual([0, 2, 2]);
  });

  it("encodeMatrix", () => {
    const expected = [
      [0, 1, 1, 2],
      [0, 4],
      [1, 4],
      [0, 3, 1],
      [0, 2, 2],
    ];
    expect(input.map(encodeRow)).toEqual(expected);
  });

  it("compareRows", () => {
    expect(compareRows([0, 1, 2], [0, 1, 2, 3])).toEqual(false);
    expect(compareRows([0, 1, 2, 3], [0, 1, 2])).toEqual(false);
    expect(compareRows([0, 1, 2, 3], [0, 1, 2, 3])).toEqual(true);
  });
});

const inputToy1 = [
  "#.##..##.",
  "..#.##.#.",
  "##......#",
  "##......#",
  "..#.##.#.",
  "..##..##.",
  "#.#.##.#.",
];

const inputToy2 = [
  "#...##..#", //0
  "#....#..#", //1
  "..##..###", //2
  "#####.##.", //3
  "#####.##.", //4
  "..##..###", //5
  "#....#..#", //6
];

const solverRow: Solver = new Solver(inputToy2);
const solverColumn: Solver = new Solver(inputToy1);

describe("solver", () => {
  it("verifyMirror", () => {
    expect(verifyMirror(0, solverRow.encodedMatrix)).toEqual(false);
    expect(verifyMirror(1, solverRow.encodedMatrix)).toEqual(false);
    expect(verifyMirror(2, solverRow.encodedMatrix)).toEqual(false);
    expect(verifyMirror(3, solverRow.encodedMatrix)).toEqual(true);
    expect(verifyMirror(4, solverRow.encodedMatrix)).toEqual(false);
    expect(verifyMirror(5, solverRow.encodedMatrix)).toEqual(false);
  });

  it("findMirror", () => {
    expect(solverRow.findMirror()).toEqual(400);
  });

  it("flipMatrix inputToy1", () => {
    const inputToyColumnFlipped = flipMatrix(inputToy1);
    const solver = new Solver(inputToyColumnFlipped);
    expect(solver.findMirror()).toEqual(500);
  });

  it("findMirrorColumn", () => {
    expect(solverColumn.findMirror()).toEqual(5);
  });
});

describe("solver smudge", () => {
  it("compareRowsBinary", () => {
    expect(compareRowsBinary([0, 1, 0, 0], [0, 1, 0, 0])).toEqual(0);
    expect(compareRowsBinary([0, 1, 0, 0], [0, 1, 0, 1])).toEqual(1);
    expect(compareRowsBinary([0, 1, 0, 0], [0, 1, 1, 1])).toEqual(2);
    expect(compareRowsBinary([0, 1, 1, 0], [0, 1, 0, 0])).toEqual(1);
  });

  it("verifyMirrorSmudge", () => {
    const binaryEncodedToy1 = encodeMatrixBinary(inputToy1);

    expect(verifyMirrorSmudge(0, encodeMatrixBinary(inputToy1), 0, 0)).toEqual(
      compareRowsBinary(binaryEncodedToy1[0], binaryEncodedToy1[1])
    );
    expect(verifyMirrorSmudge(1, encodeMatrixBinary(inputToy1), 0, 0)).toEqual(
      compareRowsBinary(binaryEncodedToy1[1], binaryEncodedToy1[2])
    );
    expect(verifyMirrorSmudge(2, encodeMatrixBinary(inputToy1), 0, 0)).toEqual(
      1
    );
  });
  it("findMirrorSmudge", () => {
    expect(new SolverSmudge(inputToy1).findMirrorSmudge()).toEqual(300);
    expect(new SolverSmudge(inputToy2).findMirrorSmudge()).toEqual(100);
  });
});
