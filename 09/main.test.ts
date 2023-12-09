import {
  calculateBackwards,
  calculateDifferenceSeries,
  calculateNextPrevision,
  generateDifferenceSequence,
  isAllZeroes,
  parseLine,
} from "./main";

describe("09", function () {
  it("parseLine", () => {
    expect(parseLine("1 2 3 4")).toEqual([1, 2, 3, 4]);
    expect(parseLine("0 3 6 9 12 15")).toEqual([0, 3, 6, 9, 12, 15]);
    expect(parseLine("-1 -2 -3 -4")).toEqual([-1, -2, -3, -4]);
    expect(parseLine("")).toEqual([]);
  });

  it("generateDifferenceSequence", () => {
    expect(generateDifferenceSequence([1, 2, 3, 4])).toEqual([1, 1, 1]);
    expect(generateDifferenceSequence([0, 3, 6, 9, 12, 15])).toEqual([
      3, 3, 3, 3, 3,
    ]);
    expect(generateDifferenceSequence([-1, -2, -3, -4])).toEqual([-1, -1, -1]);
  });

  it("isAllZeroes", () => {
    expect(isAllZeroes([0, 0, 0, 0, 0])).toBe(true);
    expect(isAllZeroes([0, 0, 0, 0, 1])).toBe(false);
    expect(isAllZeroes([1, 0, 0, 0, 0])).toBe(false);
  });

  it("calculateDifferenceSeries", () => {
    expect(calculateDifferenceSeries([0, 3, 6, 9, 12, 15])).toEqual([
      [0, 3, 6, 9, 12, 15],
      [3, 3, 3, 3, 3],
      [0, 0, 0, 0],
    ]);
  });

  it("calculateNextPrevision", () => {
    expect(
      calculateNextPrevision(calculateDifferenceSeries([0, 3, 6, 9, 12, 15]))
    ).toBe(18);
  });

  it("calculateBackwards", () => {
    expect(
      calculateBackwards(
        calculateDifferenceSeries(parseLine("10 13 16 21 30 45"))
      )
    ).toBe(5);
  });

  it("calculateBackwards", () => {
    expect(
      calculateBackwards(calculateDifferenceSeries(parseLine("0 3 6 9 12 15")))
    ).toBe(-3);
  });
});
