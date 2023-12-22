import { syncReadFile } from "../utils/utils";
import { Direction, LightBeam, proceed } from "./main";

describe("16", () => {
  it("lightbeam constructor", () => {
    const input: string[] = [
      "..|.", //prettier-ignore
      ".|/.",
      ".-.\\",
      "....",
    ];
    const lightbeam = new LightBeam(input);
    expect(lightbeam.map[1][1]).toEqual("|");
    expect(lightbeam.map[3][3]).toEqual(".");
  });

  it("proceed", () => {
    expect(proceed(0, 0, Direction.East)).toEqual([0, 1]);
    expect(proceed(0, 0, Direction.North)).toEqual([-1, 0]);
    expect(proceed(0, 0, Direction.South)).toEqual([1, 0]);
    expect(proceed(0, 0, Direction.West)).toEqual([0, -1]);
  });

  it("buildPath", () => {
    const input: string[] = [
      "....\\", //prettier-ignore
      "/.\\..",
      ".....",
      "\\.-./",
    ];

    const lightbeam = new LightBeam(input);
    lightbeam.buildPath(0, -1, Direction.East);
    expect(lightbeam.countAlreadyVisited()).toEqual(17);
  });

  const inputToy = syncReadFile("16/input.toy.txt");

  it("buildPath from North", () => {
    const lightbeam = new LightBeam(inputToy);
    lightbeam.buildPath(-1, 3, Direction.South);
    expect(lightbeam.countAlreadyVisited()).toEqual(51);
  });

  it("checkExited", () => {
    const lightbeam = new LightBeam(inputToy);
    lightbeam.buildPath(0, -1, Direction.East);
    expect(lightbeam.exitedNorth).toEqual(new Set([1]));
    expect(lightbeam.exitedWest).toEqual(new Set([7]));
    expect(lightbeam.exitedSouth).toEqual(new Set([1, 5, 7]));
    expect(lightbeam.exitedEast).toEqual(new Set([2]));
  });

  it("foundMaxVisited", () => {
    const lightbeam = new LightBeam(inputToy);
    lightbeam.foundMaxVisited();
    expect(lightbeam.maxVisited).toEqual(51);
  });
});
