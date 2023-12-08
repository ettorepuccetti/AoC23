import { assert } from "console";
import { syncReadFile } from "../utils/utils";

export interface RaceStats {
  duration: number;
  distanceRecord: number;
}

export function getRacesStats(input: string[]): RaceStats[] {
  const parseNumbers = (str: string): number[] => {
    return str
      .split(": ")[1]
      .trim()
      .split(" ")
      .map((str) => parseInt(str))
      .filter((n) => !Number.isNaN(n));
  };
  const result: RaceStats[] = [];
  const times: number[] = parseNumbers(input[0]);
  const distances: number[] = parseNumbers(input[1]);

  assert(times.length === distances.length);

  for (let i = 0; i < times.length; i++) {
    result.push({
      duration: times[i],
      distanceRecord: distances[i],
    });
  }

  return result;
}
export const parseNumbersAvoidingSpaces = (str: string): number => {
  return parseInt(str.split(": ")[1].replaceAll(" ", ""));
};

export const getSingleRaceStat = (input: string[]): RaceStats => {
  return {
    duration: parseNumbersAvoidingSpaces(input[0]),
    distanceRecord: parseNumbersAvoidingSpaces(input[1]),
  };
};

export function getSecondsToHoldButton(raceStats: RaceStats): number[] {
  const result: number[] = [];
  for (let timeHolding = 1; timeHolding < raceStats.duration; timeHolding++) {
    const distance = (raceStats.duration - timeHolding) * timeHolding;
    if (distance > raceStats.distanceRecord) {
      result.push(timeHolding);
    }
  }
  return result;
}

function firstPuzzleResolver(inputFile: string) {
  let result: number = 1;
  const input: string[] = syncReadFile(inputFile);
  const raceStats: RaceStats[] = getRacesStats(input);
  for (let raceStat of raceStats) {
    const secondsToHoldButton: number[] = getSecondsToHoldButton(raceStat);
    result *= secondsToHoldButton.length;
  }
  console.log("first puzzle: ", result);
}

function secondPuzzleResolver(inputFile: string) {
  const input: string[] = syncReadFile(inputFile);
  const raceStat = getSingleRaceStat(input);
  const secondsToHoldButton = getSecondsToHoldButton(raceStat);
  console.log("second puzzle: ", secondsToHoldButton.length);
}

firstPuzzleResolver("06/input.txt");
secondPuzzleResolver("06/input.txt");