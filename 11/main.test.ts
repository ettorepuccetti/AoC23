import { syncReadFile } from "../utils/utils";
import {
  addEmptyColumn,
  addEmptyRow,
  buildDistanceMatrix,
  buildGalaxyMatrix,
  calculateDistance,
  expandUniverse,
  findEmptyColumn,
  findEmptyRow,
  sumDistances,
} from "./main";

const inputLinesToy = syncReadFile("11/input.toy.txt");
const inputLines = [
  "..#..", // force prettier to not collapse
  "#....",
  ".....",
  "....#",
  ".#...",
];
describe("11", () => {
  it("readfile", () => {
    expect(inputLinesToy[0]).toEqual("...#......");
  });

  it("buildGalaxyMatrix", () => {
    const expected = [
      [0, 2],
      [1, 0],
      [3, 4],
      [4, 1],
    ];

    expect(buildGalaxyMatrix(inputLines)).toEqual(expected);
  });

  it("calculateDistance", () => {
    expect(calculateDistance([0, 2], [3, 4])).toEqual(5);
    expect(calculateDistance([0, 2], [3, 2])).toEqual(3);
    expect(calculateDistance([0, 7], [0, 2])).toEqual(5);
    expect(calculateDistance([6, 1], [11, 5])).toEqual(9);
  });

  it("buildDistanceMatrix", () => {
    const galaxyMatrix = [
      [0, 2],
      [1, 0],
      [3, 4],
      [4, 1],
    ];
    const expected = [
      [0, 3, 5, 5],
      [3, 0, 6, 4],
      [5, 6, 0, 4],
      [5, 4, 4, 0],
    ];
    expect(buildDistanceMatrix(galaxyMatrix)).toEqual(expected);
  });

  it("findEmptyRow", () => {
    expect(findEmptyRow(inputLines)).toEqual([2]);
  });

  it("findEmptyCol", () => {
    expect(findEmptyColumn(inputLines)).toEqual([3]);
  });

  it("addEmptyColumn", () => {
    expect(addEmptyColumn(inputLines, 3)).toEqual([
      "..#...",
      "#.....",
      "......",
      ".....#",
      ".#....",
    ]);
  });

  it("addEmptyRow", () => {
    expect(addEmptyRow(inputLines, 2)).toEqual([
      "..#..",
      "#....",
      ".....",
      ".....",
      "....#",
      ".#...",
    ]);
  });

  it("expandUniverse", () => {
    const expectedExpanded = [
      "..#...",
      "#.....",
      "......",
      "......",
      ".....#",
      ".#....",
    ];
    expect(expandUniverse(inputLines)).toEqual(expectedExpanded);
  });

  it("sumDistances", () => {
    const distanceMatrix = [
      [0, 3, 5, 5],
      [3, 0, 6, 4],
      [5, 6, 0, 4],
      [5, 4, 4, 0],
    ];
    expect(sumDistances(distanceMatrix)).toEqual(27);
  });

  it("check empty row on toy input", () => {
    expect(findEmptyRow(inputLinesToy)).toEqual([3, 7]);
  });

  it("check empty column on toy input", () => {
    expect(findEmptyColumn(inputLinesToy)).toEqual([2, 5, 8]);
  });

  it("expandUniverse check on row", () => {
    const input = [
      "##...", // prettier
      ".....",
      "..###",
      ".....",
    ];
    const expected = [
      "##...", // prettier
      ".....",
      ".....",
      "..###",
      ".....",
      ".....",
    ];

    const actual = expandUniverse(input);

    expect(actual).toEqual(expected);
  });

  it("expandUniverse check on column", () => {
    const input = [
      "#.#.", // prettier
    ];
    const expected = [
      "#..#..", // prettier
    ];

    const actual = expandUniverse(input);

    expect(actual).toEqual(expected);
  });

  it("check expansion on toy input", () => {
    const expected = [
      "....#........",
      ".........#...",
      "#............",
      ".............",
      ".............",
      "........#....",
      ".#...........",
      "............#",
      ".............",
      ".............",
      ".........#...",
      "#....#.......",
    ];

    expect(expandUniverse(inputLinesToy)).toEqual(expected);
  });

  it("check distance on toy input", () => {
    const expandedUniverse = expandUniverse(inputLinesToy);

    const galaxyMatrix = buildGalaxyMatrix(expandedUniverse);
    const distanceMatrix = buildDistanceMatrix(galaxyMatrix);

    expect(distanceMatrix[4][8]).toEqual(9);
    expect(distanceMatrix[0][6]).toEqual(15);
    expect(distanceMatrix[2][5]).toEqual(17);
    expect(distanceMatrix[7][8]).toEqual(5);
  });
});
