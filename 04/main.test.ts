import {
  CardInfoStore,
  getCardNumber,
  processLine,
  updateReplicas,
} from "./main";

const cardLineOne = "Card   1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53";
const cardLineNoSpace = "Card 12: 41 48 83 86 17 | 83 86  6 31 17  9 48 53";

describe("getCardNumber", () => {
  it("should return the card number from the line", async () => {
    const result = getCardNumber(cardLineOne);

    expect(result).toEqual(1);
  });
  it("should return the card number from the line with space", async () => {
    const result = getCardNumber(cardLineNoSpace);

    expect(result).toEqual(12);
  });
});

describe("processLine", () => {
  it("update state with card number, winning numbers, set replicas to 1", () => {
    const result = processLine(cardLineOne);

    expect(result).toEqual({ winningNumbers: 4, replicas: 1 });
  });
});

describe("updateReplicas", () => {
  it("GIVEN 1 replica and N winning number WHEN process THEN add 1 to N subsequent cardNumber", () => {
    const doesntMatter: number = 5;
    const state: CardInfoStore = {
      1: { winningNumbers: 3, replicas: 1 },
      2: { winningNumbers: doesntMatter, replicas: 1 },
      3: { winningNumbers: doesntMatter, replicas: 1 },
      4: { winningNumbers: doesntMatter, replicas: 1 },
      5: { winningNumbers: doesntMatter, replicas: 1 },
    };

    updateReplicas(state, 1);

    expect(state).toEqual({
      1: { winningNumbers: 3, replicas: 1 },
      2: { winningNumbers: doesntMatter, replicas: 2 },
      3: { winningNumbers: doesntMatter, replicas: 2 },
      4: { winningNumbers: doesntMatter, replicas: 2 },
      5: { winningNumbers: doesntMatter, replicas: 1 },
    });
  });

  it("GIVEN N replica and M winning number WHEN process THEN add N to M subsequent cardNumber", () => {
    const doesntMatter: number = 5;

    const state: CardInfoStore = {
      1: { winningNumbers: 3, replicas: 4 },
      2: { winningNumbers: doesntMatter, replicas: 1 },
      3: { winningNumbers: doesntMatter, replicas: 1 },
      4: { winningNumbers: doesntMatter, replicas: 1 },
      5: { winningNumbers: doesntMatter, replicas: 1 },
    };

    updateReplicas(state, 1);

    expect(state).toEqual({
      1: { winningNumbers: 3, replicas: 4 },
      2: { winningNumbers: doesntMatter, replicas: 5 },
      3: { winningNumbers: doesntMatter, replicas: 5 },
      4: { winningNumbers: doesntMatter, replicas: 5 },
      5: { winningNumbers: doesntMatter, replicas: 1 },
    });
  });

  it("GIVEN I would update a card number grater then last WHEN process THEN stop before", () => {
    const doesntMatter: number = 5;
    
    const state: CardInfoStore = {
      1: { winningNumbers: 3, replicas: 4 },
      2: { winningNumbers: doesntMatter, replicas: 1 },
      3: { winningNumbers: doesntMatter, replicas: 1 },
    };

    updateReplicas(state, 1);

    expect(state).toEqual({
      1: { winningNumbers: 3, replicas: 4 },
      2: { winningNumbers: doesntMatter, replicas: 5 },
      3: { winningNumbers: doesntMatter, replicas: 5 },
    });

    expect(state[4]).toBeUndefined();
  });
});
