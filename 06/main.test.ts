import {
  RaceStats,
  getRacesStats,
  getSecondsToHoldButton,
  getSingleRaceStat,
  parseNumbersAvoidingSpaces,
} from "./main";

describe("06", () => {
  it("getRaceStats", () => {
    const input = ["Time:      7  15   30", "Distance:  9  40  200"];
    const expected: RaceStats[] = [
      {
        duration: 7,
        distanceRecord: 9,
      },
      {
        duration: 15,
        distanceRecord: 40,
      },
      {
        duration: 30,
        distanceRecord: 200,
      },
    ];

    expect(getRacesStats(input)).toEqual(expected);
  });

  it("getSecondsToHoldButton first race", () => {
    const raceStats = {
      duration: 7,
      distanceRecord: 9,
    };
    expect(getSecondsToHoldButton(raceStats)).toEqual([2, 3, 4, 5]);
  });

  it("getSecondsToHoldButton second race", () => {
    const raceStats = {
      duration: 15,
      distanceRecord: 40,
    };
    expect(getSecondsToHoldButton(raceStats)).toEqual([
      4, 5, 6, 7, 8, 9, 10, 11,
    ]);
  });

  it("getSecondsToHoldButton third race", () => {
    const raceStats = {
      duration: 30,
      distanceRecord: 200,
    };

    // array [11, 12, ..., 19]
    const expected = Array.from(
      { length: 19 - 11 + 1 },
      (_, index) => 11 + index
    );

    expect(getSecondsToHoldButton(raceStats)).toEqual(expected); //range from 11 to 19
  });

  it("parseNumbersAvoidingSpaces", () => {
    const input = "Time:      7  15   30";
    const expected = 71530;
    expect(parseNumbersAvoidingSpaces(input)).toEqual(expected);
  });

  it("getSingleRaceStat", () => {
    const input = ["Time:      7  15   30", "Distance:  9  40  200"];
    const expected = {
      duration: 71530,
      distanceRecord: 940200,
    };
    expect(getSingleRaceStat(input)).toEqual(expected);
  });
});
