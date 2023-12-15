import { syncReadFile } from "../utils/utils";

export class Solver {
  cache: Map<string, number> = new Map();

  inputString: string;
  groups: number[];

  constructor(inputString: string, groups: number[]) {
    this.inputString = inputString;
    this.groups = groups;
  }

  findArrangments(strStartIndex: number = 0, groupIndex: number = 0): number {
    let possibleArrang = 0;
    const group: number = this.groups[groupIndex];
    const slidingWindowLastIndex =
      this.inputString.length - this.groups[groupIndex] + 1;
    for (
      let strCurrentIndex = strStartIndex;
      strCurrentIndex < slidingWindowLastIndex;
      strCurrentIndex++
    ) {
      const slidingWindow = this.inputString.slice(
        strCurrentIndex,
        strCurrentIndex + group
      );
      const nextStringIndex = strCurrentIndex + group;

      // still valid arrangment (no dot)
      if (!slidingWindow.includes(".")) {
        // if it is the last group to consider
        if (groupIndex === this.groups.length - 1) {
          // and no more assignments to do (string end or no more # until the end)
          if (
            nextStringIndex === this.inputString.length ||
            !this.inputString.slice(nextStringIndex).includes("#")
          ) {
            possibleArrang++;
          }
        }
        // if there is still a substring after the current separator, recursively try to assing the remaining groups.
        else if (
          nextStringIndex < this.inputString.length &&
          this.inputString.at(nextStringIndex) !== "#"
        ) {
          possibleArrang += this.cacheFindArrang(
            nextStringIndex + 1,
            groupIndex + 1
          )!;
        }
      }
      if (slidingWindow.startsWith("#")) {
        break;
      }
    }
    return possibleArrang;
  }

  cacheFindArrang(...args: number[]) {
    const input: string = JSON.stringify(args);
    if (!this.cache.has(input)) {
      // console.log("cache MISS", "input", input);
      this.cache.set(input, this.findArrangments(...args));
    } else {
      // console.log("cache HIT", "input", input);
    }
    return this.cache.get(input);
  }
}

export function repeatSpringRow(
  springRow: string,
  separator: string,
  repetitions: number
) {
  return Array(repetitions).fill(springRow).join(separator);
}

export function repeatGroups(groups: number[], repetitions: number) {
  return Array(repetitions).fill(groups).flat();
}

function firstPuzzleResolver(filePath: string) {
  const inputLines: string[] = syncReadFile(filePath).filter(
    (line) => line.length > 0
  );
  let result = 0;
  for (let inputLine of inputLines) {
    const [inputSequence, expectedSequence] = inputLine.split(" ");
    const groups: number[] = expectedSequence
      .split(",")
      .map((s: string) => parseInt(s));

    const solver: Solver = new Solver(
      repeatSpringRow(inputSequence, "?", 1),
      repeatGroups(groups, 1)
    );

    result += solver.cacheFindArrang(0, 0)!;
  }
  console.log("12: First puzzle: ", result);
}

function secondPuzzleResolver(filePath: string) {
  const inputLines: string[] = syncReadFile(filePath).filter(
    (line) => line.length > 0
  );
  let result = 0;
  for (let inputLine of inputLines) {
    const [inputSequence, expectedSequence] = inputLine.split(" ");
    const groups: number[] = expectedSequence
      .split(",")
      .map((s: string) => parseInt(s));

    const solver: Solver = new Solver(
      repeatSpringRow(inputSequence, "?", 5),
      repeatGroups(groups, 5)
    );

    result += solver.cacheFindArrang(0, 0)!;
  }
  console.log("12: Second puzzle: ", result);
}

firstPuzzleResolver("12/input.txt");
secondPuzzleResolver("12/input.txt");
