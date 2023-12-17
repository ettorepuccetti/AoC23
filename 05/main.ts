import { syncReadFile } from "../utils/utils";

const N_OF_LINES_TO_SKIP = 2;

export function getSeeds(firstLine: string): number[] {
  return firstLine
    .split(":")[1]
    .trim()
    .split(" ")
    .map((s) => parseInt(s));
}

interface ICustomMap {
  get(input: number): number;
  setRange(from: number, to: number, length: number): void;
}

interface MapRange {
  rangeStart: number;
  rangeEnd: number;
  offset: number;
}

export class CustomMap implements ICustomMap {
  mapRanges: MapRange[] = [];

  get(input: number): number {
    for (let mapRange of this.mapRanges) {
      if (input >= mapRange.rangeStart && input < mapRange.rangeEnd) {
        return input + mapRange.offset;
      }
    }
    return input;
  }

  setRange(from: number, to: number, length: number) {
    this.mapRanges.push({
      rangeStart: from,
      rangeEnd: from + length,
      offset: to - from,
    });
  }
}

export interface CustomMaps {
  [mapKey: number]: ICustomMap;
}

export const parseMappingLine = (inputString: string) => {
  const [to, from, length] = inputString.split(" ").map((s) => parseInt(s));
  return { from, to, length };
};

export function buildMap(inputStrings: string[]): ICustomMap {
  const result: ICustomMap = new CustomMap();

  for (let inputString of inputStrings) {
    const { from, to, length } = parseMappingLine(inputString);
    result.setRange(from, to, length);
  }
  return result;
}

export function traverseAllMaps(inputSeed: number, maps: CustomMaps): number {
  let currentMappedValue: number = inputSeed;
  for (let mapIndex of Object.keys(maps).sort()) {
    const currentMap = maps[parseInt(mapIndex)];
    currentMappedValue = currentMap.get(currentMappedValue);
  }
  return currentMappedValue;
}

export function getPopulatedMaps(fileLines: string[]) {
  const result: CustomMaps = {};
  let mapIndex = 0;
  let linesForMapBuilder: string[] = [];

  for (const [index, line] of fileLines.entries()) {
    if (line.endsWith("map:")) {
      mapIndex++;
      linesForMapBuilder = [];
      continue;
    }

    if (line === "") {
      result[mapIndex] = buildMap(linesForMapBuilder);
      continue;
    }

    linesForMapBuilder.push(line);

    if (index === fileLines.length - 1) {
      result[mapIndex] = buildMap(linesForMapBuilder);
    }
  }
  return result;
}

export function firstPuzzleResolver(filePath: string) {
  const fileAsArrayOfLines: string[] = syncReadFile(filePath);

  // populate maps
  const populatedMaps: CustomMaps = getPopulatedMaps(
    fileAsArrayOfLines.slice(N_OF_LINES_TO_SKIP)
  );

  // get seeds
  const seeds: number[] = getSeeds(fileAsArrayOfLines[0]);

  // traverse all maps for each seed
  const seedsMapped = seeds.map((seed) => traverseAllMaps(seed, populatedMaps));

  // return minimun mapped seed
  console.log("first puzzle: ", Math.min(...seedsMapped));
}

export function extractSeedRanges(seedFileLine: string): SeedRange[] {
  const result: SeedRange[] = [];
  const numbers = seedFileLine.split(":")[1].trim().split(" ");

  let seedRangeStart: number;
  for (let [index, number] of numbers.entries()) {
    if (index % 2 === 0) {
      seedRangeStart = parseInt(number);
    } else {
      const seedRange: SeedRange = {
        start: seedRangeStart!,
        end: seedRangeStart! + parseInt(number) - 1,
      };
      result.push(seedRange);
    }
  }
  return result;
}

export interface SeedRange {
  start: number;
  end: number;
}

export class SeedIterator {
  seedRanges: SeedRange[];
  currentSeedIndex: number;
  currentRangeIndex: number;

  constructor(seedFileLine: string) {
    this.seedRanges = extractSeedRanges(seedFileLine);
    this.currentRangeIndex = 0;
    this.currentSeedIndex = -1;
  }

  getNext(): number {
    this.currentSeedIndex++;
    const result =
      this.seedRanges[this.currentRangeIndex].start + this.currentSeedIndex;

    if (
      this.seedRanges[this.currentRangeIndex].start + this.currentSeedIndex ===
      this.seedRanges[this.currentRangeIndex].end
    ) {
      this.currentRangeIndex++;
      this.currentSeedIndex = -1;
    }
    return result;
  }

  hasNext(): boolean {
    return this.currentRangeIndex < this.seedRanges.length;
  }
}

function secondPuzzleResolver(filePath: string) {
  const fileAsArrayOfLines: string[] = syncReadFile(filePath);

  // get seeds iterator
  const seedIterator = new SeedIterator(fileAsArrayOfLines[0]);

  // populate maps
  const populatedMaps: CustomMaps = getPopulatedMaps(
    fileAsArrayOfLines.slice(N_OF_LINES_TO_SKIP)
  );

  //for each seed, traverse all maps and compare the result with the current minimum
  let currentMinimun = Number.POSITIVE_INFINITY;
  while (seedIterator.hasNext()) {
    const seed = seedIterator.getNext();
    const mappedSeed = traverseAllMaps(seed, populatedMaps);
    if (mappedSeed < currentMinimun) {
      console.log("new minimun: ", mappedSeed);
      currentMinimun = mappedSeed;
    }
  }
  console.log("second puzzle: ", currentMinimun);
}

firstPuzzleResolver("05/input.txt");
//secondPuzzleResolver("05/input.txt");
