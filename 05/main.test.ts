import exp from "constants";
import {
  CustomMap,
  CustomMaps,
  SeedIterator,
  SeedRange,
  buildMap,
  extractSeedRanges,
  getPopulatedMaps,
  getSeeds,
  parseMappingLine,
} from "./main";

describe("05", () => {
  it("getSeeds", () => {
    expect(getSeeds("seeds: 79 14 55 13")).toEqual([79, 14, 55, 13]);
  }),
    it("parseMappingLine", () => {
      expect(parseMappingLine("50 98 2")).toEqual({
        from: 98,
        to: 50,
        length: 2,
      });
    }),
    it("CustomMap", () => {
      const map = new CustomMap();
      map.setRange(98, 50, 2);
      expect(map.mapRanges).toEqual([
        {
          rangeStart: 98,
          rangeEnd: 100,
          offset: -48,
        },
      ]);
      expect(map.get(98)).toEqual(50);
      expect(map.get(99)).toEqual(51);
      expect(map.get(100)).toEqual(100);
    });

  it("buildMap", () => {
    const builtMap = buildMap(["50 98 2", "52 50 3"]);
    expect(builtMap.get(98)).toEqual(50);
    expect(builtMap.get(99)).toEqual(51);
    expect(builtMap.get(100)).toEqual(100);
    expect(builtMap.get(50)).toEqual(52);
    expect(builtMap.get(51)).toEqual(53);
  });

  it("getPopulatedMaps multiple maps", () => {
    const inputFile = [
      "seed-to-soil map:",
      "50 98 2",
      "52 50 48",
      "",
      "soil-to-fertilizer map:",
      "0 15 37",
      "37 52 2",
      "39 0 15",
      "",
      "fertilizer-to-water map:",
      "49 53 8",
      "0 11 42",
      "42 0 7",
      "57 7 4",
    ];
    const actualResult = getPopulatedMaps(inputFile);
    const expectedResult: CustomMaps = {
      1: buildMap(["50 98 2", "52 50 48"]),
      2: buildMap(["0 15 37", "37 52 2", "39 0 15"]),
      3: buildMap(["49 53 8", "0 11 42", "42 0 7", "57 7 4"]),
    };
    expect(actualResult).toEqual(expectedResult);
  });

  it("getPopulatedMaps single map", () => {
    const inputFile = ["seed-to-soil map:", "50 98 2", "52 50 5", ""];
    const actualResult = getPopulatedMaps(inputFile);
    const expectedResult: CustomMaps = {
      1: buildMap(["50 98 2", "52 50 5"]),
    };
    expect(actualResult).toEqual(expectedResult);
  });

  it("extractSeedRanges", () => {
    const inputLineFile = "seeds: 79 2 55 3";
    const actualResult = extractSeedRanges(inputLineFile);
    const expectedResult: SeedRange[] = [
      {
        start: 79,
        end: 80,
      },
      {
        start: 55,
        end: 57,
      },
    ];
    expect(actualResult).toEqual(expectedResult);
  });

  it("SeedIterator", () => {
    const inputFileLine = "seeds: 79 2 55 3";
    const seedIterator: SeedIterator = new SeedIterator(inputFileLine);

    expect(seedIterator.getNext()).toEqual(79);
    expect(seedIterator.getNext()).toEqual(80);
    expect(seedIterator.hasNext()).toEqual(true);
    expect(seedIterator.getNext()).toEqual(55);
    expect(seedIterator.getNext()).toEqual(56);
    expect(seedIterator.getNext()).toEqual(57);
    expect(seedIterator.hasNext()).toEqual(false);
  });
});
