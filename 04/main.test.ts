import { getCardNumber } from "./main";

describe("getCardNumber", () => {
  it("should return the card number from the line", () => {
    const line = "Card number: 1234";
    const expected = 1234;

    const result = getCardNumber(line);

    expect(result).toEqual(expected);
  });
});
