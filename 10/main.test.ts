import {
  Direction,
  Pipes,
  buildLoop,
  findAnimalPosition,
  findStartingTube,
  moveTowardDirection,
  pipeToNextDirection,
} from "./main";

describe("09", () => {
  const inputTest = [
    ".....", //do not collapse when prettier
    ".S-7.", //do not collapse when prettier
    ".|.|.", //do not collapse when prettier
    ".L-J.", //do not collapse when prettier
    ".....", //do not collapse when prettier
  ];

  const inputTest2 = [
    "..F7.", //do not collapse when prettier
    ".FJ|.", //do not collapse when prettier
    "SJ.L7", //do not collapse when prettier
    "|F--J", //do not collapse when prettier
    "LJ...", //do not collapse when prettier
  ];
  it("findAnimalPosition", () => {
    expect(findAnimalPosition(inputTest)).toEqual([1, 1]);
  });

  it("findStartingTube", () => {
    expect(findStartingTube(inputTest, 1, 1)).toEqual([1, 2, Direction.East]);
  });

  it("pipeToNextDirection", () => {
    expect(pipeToNextDirection(Pipes.NorthEast, Direction.South)).toEqual(
      Direction.East
    );
    expect(pipeToNextDirection(Pipes.NorthEast, Direction.West)).toEqual(
      Direction.North
    );
    expect(pipeToNextDirection(Pipes.SouthWest, Direction.East)).toEqual(
      Direction.South
    );
    expect(pipeToNextDirection(Pipes.NorthWest, Direction.South)).toEqual(
      Direction.West
    );
  });

  it("moveTowardDirection", () => {
    expect(
      moveTowardDirection(Direction.East, 1, 1, Infinity, Infinity)
    ).toEqual([1, 2]);

    expect(
      moveTowardDirection(Direction.South, 1, 2, Infinity, Infinity)
    ).toEqual([2, 2]);

    expect(
      moveTowardDirection(Direction.South, 1, 2, Infinity, Infinity)
    ).toEqual([2, 2]);

    expect(
      moveTowardDirection(Direction.West, 2, 2, Infinity, Infinity)
    ).toEqual([2, 1]);

    expect(moveTowardDirection(Direction.West, 3, 4, 5, 5)).toEqual([3, 3]);
  });

  it("buildLoop", () => {
    expect(buildLoop(inputTest).length).toEqual(8);
  });

  it("buildLoop2", () => {
    expect(buildLoop(inputTest2).length).toEqual(16);
  });

  it("array test", () => {
    const matrix = [
      [1, 2],
      [3, 4],
    ];
    expect(
      matrix.filter(([a, b]: number[]) => {
        return a === 1 && b === 2;
      }).length
    ).toBe(1);
  });
});
