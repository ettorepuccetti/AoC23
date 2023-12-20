import { Box, parseInstruction, processChar, processString } from "./main";

describe("15", () => {
  it("processChar", () => {
    expect(processChar("H", 0)).toBe(200);
  });

  it("processString", () => {
    expect(processString("HASH")).toBe(52);
  });

  it("parseInstruction", () => {
    expect(parseInstruction("rn=1")).toStrictEqual(["rn", 1]);
    expect(parseInstruction("rn-")).toStrictEqual(["rn", undefined]);
  });
});

describe("Box", () => {
  it("insertLens", () => {
    const box = new Box();

    box.insertLens("pc", 4);
    box.insertLens("ot", 9);
    box.insertLens("ab", 5);
    box.insertLens("ot", 7);
    expect(box.lensArray).toStrictEqual(["pc", "ot", "ab"]);
    expect(box.lensToFocalLength.get("ot")).toBe(7);
    expect(box.lensToFocalLength.get("ab")).toBe(5);
  });

  it("removeLens", () => {
    const box = new Box();

    box.insertLens("pc", 4);
    box.insertLens("ot", 9);
    box.insertLens("ab", 5);

    box.removeLens("pc");
    expect(box.lensArray).toStrictEqual(["ot", "ab"]);
    expect(box.lensToFocalLength.get("pc")).toBe(undefined);
  });

  it("calculateFocusingPower", () => {
    const box = new Box();
    box.insertLens("pc", 4);
    box.insertLens("ot", 9);
    box.insertLens("ab", 5);
    box.removeLens("pc");
    box.insertLens("pc", 6);
    box.insertLens("ot", 7);

    expect(box.calculateFocusingPower(4)).toBe(140);
  });
});
