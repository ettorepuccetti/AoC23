import { flipMatrix } from "../utils/utils";
import {
  Solver,
  countRocksDistance,
  moveRocksRowToRight,
  moveRocksRowtoLeft,
  spinCycle,
  tiltEast,
  tiltNorth,
  tiltSouth,
  tiltWest,
} from "./main";

const inputToy = [
  "O....#....",
  "O.OO#....#",
  ".....##...",
  "OO.#O....O",
  ".O.....O#.",
  "O.#..O.#.#",
  "..O..#O..O",
  ".......O..",
  "#....###..",
  "#OO..#....",
];
describe("14", () => {
  it("countDistanceRock", () => {
    const inputLine = "##..O.O.OO";
    expect(countRocksDistance(inputLine)).toBe(34);
  });

  it("moveRocksToRight", () => {
    expect(moveRocksRowToRight(flipMatrix(inputToy)[0])).toEqual("##....OOOO");
  });

  it("moveRocksRowToLeft", () => {
    expect(moveRocksRowtoLeft(flipMatrix(inputToy)[0])).toEqual("##OOOO....");
  });

  it("tiltNorth", () => {
    const expected = [
      "OOOO.#.O..",
      "OO..#....#",
      "OO..O##..O",
      "O..#.OO...",
      "........#.",
      "..#....#.#",
      "..O..#.O.O",
      "..O.......",
      "#....###..",
      "#....#....",
    ];
    expect(tiltNorth(inputToy)).toEqual(expected);
  });

  it("tiltWest", () => {
    const input = [
      "O..#", //prettier
      ".#.O",
      ".##.",
      "..O.",
    ];
    const expected = [
      "O..#", // prettier
      ".#O.",
      ".##.",
      "O...",
    ];
    expect(tiltWest(input)).toEqual(expected);
  });

  it("tiltSouth", () => {
    const input = [
      "O.O#", //prettier
      ".#.O",
      ".##.",
      "..O.",
    ];
    const expected = [
      "...#", // prettier
      ".#O.",
      ".##.",
      "O.OO",
    ];
    const solver: Solver = new Solver(input);
    expect(tiltSouth(input)).toEqual(expected);
  });

  it("tiltEast", () => {
    const input = [
      "O..#", //prettier
      ".#.O",
      ".##.",
      "..O.",
    ];
    const expected = [
      "..O#", // prettier
      ".#.O",
      ".##.",
      "...O",
    ];
    expect(tiltEast(input)).toEqual(expected);
  });

  it("tiltNorth and tiltWest", () => {
    const input = [
      "...#", //prettier
      "O#.O",
      ".O..",
      "..O.",
    ];
    const expected = [
      "OO.#", // prettier
      ".#O.",
      "O...",
      "....",
    ];
    expect(tiltWest(tiltNorth(input))).toEqual(expected);
  });

  it("spinCycle", () => {
    const solver: Solver = new Solver(inputToy);
    const expected = [
      ".....#....",
      "....#...O#",
      "...OO##...",
      ".OO#......",
      ".....OOO#.",
      ".O#...O#.#",
      "....O#....",
      "......OOOO",
      "#...O###..",
      "#..OO#....",
    ];
    expect(spinCycle(inputToy)).toEqual(expected);
  });

  const expectedAfterThreeCycles = [
    ".....#....",
    "....#...O#",
    ".....##...",
    "..O#......",
    ".....OOO#.",
    ".O#...O#.#",
    "....O#...O",
    ".......OOO",
    "#...O###.O",
    "#.OOO#...O",
  ];

  it("spinCycle three times", () => {
    const actual = spinCycle(spinCycle(spinCycle(inputToy)));
    expect(actual).toEqual(expectedAfterThreeCycles);
  });

  it("checkLoopSkipping", () => {
    const solver: Solver = new Solver(inputToy);
    solver.findLoopStartAndLength();

    let result: string[] = inputToy;
    let statusAtLoopStart: string[];
    for (let i = 0; i <= solver.loopStart; i++) {
      result = spinCycle(result);
    }
    statusAtLoopStart = result;
    for (let i = 0; i < solver.loopLength; i++) {
      result = spinCycle(result);
    }
    expect(result).toEqual(statusAtLoopStart);
  });
});
