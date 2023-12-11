import { syncReadFile } from "../utils/utils";

export enum Pipes {
  "Vertical" = 1,
  "Horizontal" = 2,
  "NorthEast" = 3,
  "NorthWest" = 4,
  "SouthWest" = 5,
  "SouthEast" = 6,
  "NoPipe" = 7,
}

export const ANIMAL = "S";
export let MAX_ROW: number;
export let MAX_COLUMN: number;

export function charToPipe(input: string): Pipes {
  switch (input) {
    case "|":
      return Pipes.Vertical;
    case "-":
      return Pipes.Horizontal;
    case "L":
      return Pipes.NorthEast;
    case "J":
      return Pipes.NorthWest;
    case "7":
      return Pipes.SouthWest;
    case "F":
      return Pipes.SouthEast;
    case ".":
      return Pipes.NoPipe;
    default:
      throw new Error("Invalid input");
  }
}

export enum Direction {
  "North" = 0,
  "East" = 1,
  "South" = 2,
  "West" = 3,
}

export const findAnimalPosition = (inputLines: string[]): [number, number] => {
  for (let [index, line] of inputLines.entries()) {
    if (line.includes(ANIMAL)) {
      return [index, line.indexOf(ANIMAL)];
    }
  }
  throw new Error("No starting position found");
};

export function findStartingTube(
  inputLines: string[],
  startRow: number,
  startColumn: number
): [number, number, Direction] {
  const found = false;

  //check north
  const [northRow, northColumn] = [startRow - 1, startColumn];
  const northPipe = charToPipe(inputLines[northRow][northColumn]);
  if (
    northPipe === Pipes.Vertical ||
    northPipe === Pipes.SouthWest ||
    northPipe === Pipes.SouthEast
  ) {
    return [northRow, northColumn, Direction.North];
  }

  //check east
  const [eastRow, eastColumn] = [startRow, startColumn + 1];
  const eastPipe = charToPipe(inputLines[eastRow][eastColumn]);
  if (
    eastPipe === Pipes.Horizontal ||
    eastPipe === Pipes.NorthWest ||
    eastPipe === Pipes.SouthWest
  ) {
    return [eastRow, eastColumn, Direction.East];
  }

  //check south
  const [southRow, southColumn] = [startRow + 1, startColumn];
  const southPipe = charToPipe(inputLines[southRow][southColumn]);
  if (
    southPipe === Pipes.Vertical ||
    southPipe === Pipes.NorthEast ||
    southPipe === Pipes.NorthWest
  ) {
    return [southRow, southColumn, Direction.South];
  }

  //check west
  const [westRow, westColumn] = [startRow, startColumn - 1];
  const westPipe = charToPipe(inputLines[westRow][westColumn]);
  if (
    westPipe === Pipes.Horizontal ||
    westPipe === Pipes.NorthEast ||
    westPipe === Pipes.SouthEast
  ) {
    return [westRow, westColumn, Direction.West];
  }

  throw new Error("No starting tube found");
}

export function pipeToNextDirection(
  pipe: Pipes,
  incomingDirection: Direction
): Direction {
  switch (pipe) {
    case Pipes.Vertical:
      return incomingDirection;

    case Pipes.Horizontal:
      return incomingDirection;

    case Pipes.SouthWest:
      switch (incomingDirection) {
        case Direction.North:
          return Direction.West;
        case Direction.East:
          return Direction.South;
        default:
          throw new Error(
            `Invalid input. Pipe: ${Pipes[pipe]}, Incoming direction: ${Direction[incomingDirection]}`
          );
      }
    case Pipes.SouthEast:
      switch (incomingDirection) {
        case Direction.North:
          return Direction.East;
        case Direction.West:
          return Direction.South;
        default:
          throw new Error(
            `Invalid input. Pipe: ${Pipes[pipe]}, Incoming direction: ${Direction[incomingDirection]}`
          );
      }

    case Pipes.NorthEast:
      switch (incomingDirection) {
        case Direction.South:
          return Direction.East;
        case Direction.West:
          return Direction.North;
        default:
          throw new Error(
            `Invalid input. Pipe: ${Pipes[pipe]}, Incoming direction: ${Direction[incomingDirection]}`
          );
      }

    case Pipes.NorthWest:
      switch (incomingDirection) {
        case Direction.South:
          return Direction.West;
        case Direction.East:
          return Direction.North;
        default:
          throw new Error(
            `Invalid input. Pipe: ${Pipes[pipe]}, Incoming direction: ${Direction[incomingDirection]}`
          );
      }

    case Pipes.NoPipe:
      throw new Error("Jumped outside of the loop");
  }
}

export function moveTowardDirection(
  direction: Direction,
  startRow: number,
  startColumn: number,
  maxRow: number,
  maxColumn: number
): [number, number] {
  switch (direction) {
    case Direction.North:
      if (startRow === 0) {
        throw new Error("Out of bounds");
      }
      return [startRow - 1, startColumn];
    case Direction.East:
      if (startColumn === maxColumn - 1) {
        throw new Error("Out of bounds");
      }
      return [startRow, startColumn + 1];
    case Direction.South:
      if (startRow === maxRow - 1) {
        throw new Error("Out of bounds");
      }
      return [startRow + 1, startColumn];
    case Direction.West:
      if (startColumn === 0) {
        throw new Error("Out of bounds");
      }
      return [startRow, startColumn - 1];
  }
}

export const buildLoop = (inputLines: string[]) => {
  const loop: number[][] = [];
  [MAX_ROW, MAX_COLUMN] = [inputLines.length, inputLines[0].length];
  const [animalRow, animalColumn] = findAnimalPosition(inputLines);
  let [newCurrentRow, newCurrentColumn, newDirection] = findStartingTube(
    inputLines,
    animalRow,
    animalColumn
  );
  loop.push([newCurrentRow, newCurrentColumn]);
  let foundAnimal = false;
  while (!foundAnimal) {
    const currentPipe = charToPipe(inputLines[newCurrentRow][newCurrentColumn]);
    newDirection = pipeToNextDirection(currentPipe, newDirection);

    [newCurrentRow, newCurrentColumn] = moveTowardDirection(
      newDirection,
      newCurrentRow,
      newCurrentColumn,
      MAX_ROW,
      MAX_COLUMN
    );
    loop.push([newCurrentRow, newCurrentColumn]);

    if (inputLines[newCurrentRow][newCurrentColumn] === ANIMAL) {
      foundAnimal = true;
    }
  }
  return loop;
};

function firstPuzzleResolver(filePath: string) {
  const inputLines = syncReadFile(filePath);
  const halfCycleLength = buildLoop(inputLines).length / 2;
  console.log("10: First puzzle: ", halfCycleLength);
}

export function elementPresentInArray(
  element: number[],
  array: number[][]
): boolean {
  return array.some((el) => el[0] === element[0] && el[1] === element[1]);
}

export function calculateIsInternalArea(
  internalArea: boolean,
  currentPipe: Pipes,
  lastAngleSeen: Pipes
): boolean {
  const modifyCountStart: Map<Pipes, Pipes> = new Map([
    [Pipes.NorthEast, Pipes.SouthWest], //L 7
    [Pipes.SouthWest, Pipes.NorthWest], //F J
    [Pipes.SouthEast, Pipes.NorthWest],
    [Pipes.NorthWest, Pipes.SouthWest],
  ]);

  const nonModifyingPipes: Map<Pipes, Pipes> = new Map([
    [Pipes.NorthEast, Pipes.NorthWest], // L J
    [Pipes.SouthEast, Pipes.SouthWest], // F 7
    [Pipes.SouthWest, Pipes.SouthEast],
    [Pipes.NorthWest, Pipes.NorthEast],
  ]);

  if (!lastAngleSeen) {
    throw new Error("calculateCountStarted has not lastSeenAngle");
  }

  if (modifyCountStart.get(lastAngleSeen) === currentPipe) {
    return !internalArea;
  }
  if (nonModifyingPipes.get(lastAngleSeen) === currentPipe) {
    return internalArea;
  }
  console.error({
    countStarted: internalArea,
    currentPipe: Pipes[currentPipe],
    lastAngleSeen: Pipes[lastAngleSeen],
  });
  throw new Error("calculateCountStarted has invalid combination");
}

function isAngle(pipe: Pipes): boolean {
  return (
    pipe === Pipes.NorthEast ||
    pipe === Pipes.NorthWest ||
    pipe === Pipes.SouthEast ||
    pipe === Pipes.SouthWest
  );
}

function secondPuzzleResolver(filePath: string) {
  const inputLines = syncReadFile(filePath);
  const loop: number[][] = buildLoop(inputLines);

  let internalTiles = 0;
  let isInternalArea: boolean = false;
  let lastAngleSeen: Pipes | undefined;

  for (const [rowIndex, line] of inputLines.entries()) {
    // reset lastAngleSeen on every row
    lastAngleSeen = undefined;
    for (const [colIndex, char] of line.split("").entries()) {
      const coordinates = [rowIndex, colIndex];

      //if I find a piece of the loop, I need to check if I am entering the area internal to the loop or exiting it
      if (elementPresentInArray(coordinates, loop)) {
        // TODO: replace S with the correct Pipe, instead of hardcoding Pipes.SouthEast in my case
        if (char === "S") {
          lastAngleSeen = Pipes.SouthEast;
          continue;
        }

        // Angle pipe must be considered in pairs.
        // If it is the first one of the couple, save it and continue
        if (isAngle(charToPipe(char)) && !lastAngleSeen) {
          lastAngleSeen = charToPipe(char);
          continue;
        }

        // Horizonal pipe does NOT change if I am inside the loop's boundaries or outiside
        if (charToPipe(char) === Pipes.Horizontal) {
          continue;
        }

        // Vertical pipe DOES change if I am inside the loop's boundaries or outiside
        if (charToPipe(char) === Pipes.Vertical) {
          isInternalArea = !isInternalArea;
          continue;
        }

        // Angle pipe, second of the pair.
        // Check if it change the fact that I am inside the loop's boundaries or outiside
        isInternalArea = calculateIsInternalArea(
          isInternalArea,
          charToPipe(char),
          lastAngleSeen!
        );

        // Reset the angle pair
        lastAngleSeen = undefined;
      } else {

        if (isInternalArea) {
          internalTiles++;
        }
      }
    }
  }
  console.log("10: Second puzzle: ", internalTiles);
}

secondPuzzleResolver("10/input.txt");
