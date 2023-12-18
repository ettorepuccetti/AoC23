import { flipMatrix } from "../utils/utils";
import {
  Solver,
  countRocksDistance,
  moveRocksRowToRight,
  moveRocksRowtoLeft,
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
    const solver: Solver = new Solver(inputToy);
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
    solver.tiltNorth();
    expect(solver.matrix).toEqual(expected);
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
    const solver: Solver = new Solver(input);
    expect(solver.tiltWest().matrix).toEqual(expected);
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
    expect(solver.tiltSouth().matrix).toEqual(expected);
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
    const solver: Solver = new Solver(input);
    const result = solver.tiltNorth().tiltWest().matrix;
    console.log("result", result);
    expect(result).toEqual(expected);
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
    solver.spinCycle();
    expect(solver.matrix).toEqual(expected);
  });

  it("spinCycle three times", () => {
    const solver: Solver = new Solver(inputToy);
    const expected = [
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
    solver.spinCycle().spinCycle().spinCycle();
    expect(solver.matrix).toEqual(expected);
  });
});
