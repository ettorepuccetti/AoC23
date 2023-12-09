import {
  Cards,
  Hand,
  HandTypes,
  cardsBuilder,
  compareCardsNormal,
  compareHands,
  getHandTypeJoker,
  getHandTypeNormal,
  handBuilder,
} from "./main";

describe("07", () => {
  it("cardsBuilder", () => {
    const actual = cardsBuilder("32T3K");
    const expected = [Cards.Three, Cards.Two, Cards.Ten, Cards.Three, Cards.K];

    expect(actual).toEqual(expected);
  });

  it("getHandType", () => {
    const actual1 = getHandTypeNormal(cardsBuilder("32T3K"));
    const actual2 = getHandTypeNormal(cardsBuilder("T55J5"));
    const actual3 = getHandTypeNormal(cardsBuilder("KK677"));
    const actual4 = getHandTypeNormal(cardsBuilder("KTJJT"));
    const actual5 = getHandTypeNormal(cardsBuilder("QQQJA"));

    expect(actual1).toEqual(HandTypes.OnePair);
    expect(actual2).toEqual(HandTypes.ThreeOfAKind);
    expect(actual3).toEqual(HandTypes.TwoPair);
    expect(actual4).toEqual(HandTypes.TwoPair);
    expect(actual5).toEqual(HandTypes.ThreeOfAKind);
  });

  it("handBuilder", () => {
    const actual = handBuilder("32T3K 765", getHandTypeNormal);
    const expected = {
      cards: [Cards.Three, Cards.Two, Cards.Ten, Cards.Three, Cards.K],
      type: HandTypes.OnePair,
      bid: 765,
    };

    expect(actual).toEqual(expected);
  });

  it("compareCards", () => {
    expect(Cards.A - Cards.K).toBeGreaterThan(0);
    expect(Cards.K - Cards.Q).toBeGreaterThan(0);
    expect(Cards.Q - Cards.A).toBeLessThan(0);
  });

  it("compareHands", () => {
    const h1 = handBuilder("32T3K 1", getHandTypeNormal);
    const h2 = handBuilder("T55J5 1", getHandTypeNormal);
    expect(compareHands(h1, h2, compareCardsNormal)).toBeLessThan(0);

    const h3 = handBuilder("T55J5 1", getHandTypeNormal);
    const h4 = handBuilder("QQQJA 1", getHandTypeNormal);
    expect(compareHands(h3, h4, compareCardsNormal)).toBeLessThan(0);
  });

  it("sortHands", () => {
    const hands = [
      handBuilder("32T3K 1", getHandTypeNormal),
      handBuilder("T55J5 1", getHandTypeNormal),
      handBuilder("QQQJA 1", getHandTypeNormal),
      handBuilder("KTJJT 1", getHandTypeNormal),
      handBuilder("KK677 1", getHandTypeNormal),
    ];
    const actual = hands.sort((h1: Hand, h2: Hand) =>
      compareHands(h1, h2, compareCardsNormal)
    );
    const expected = [
      handBuilder("32T3K 1", getHandTypeNormal),
      handBuilder("KTJJT 1", getHandTypeNormal),
      handBuilder("KK677 1", getHandTypeNormal),
      handBuilder("T55J5 1", getHandTypeNormal),
      handBuilder("QQQJA 1", getHandTypeNormal),
    ];
    expect(actual).toEqual(expected);
  });

  it("handBuilderJoker", () => {
    const actual1 = handBuilder("32T3K 1", getHandTypeJoker);
    const expected1 = {
      cards: [Cards.Three, Cards.Two, Cards.Ten, Cards.Three, Cards.K],
      type: HandTypes.OnePair,
      bid: 1,
    };
    expect(actual1).toEqual(expected1);

    const actual2 = handBuilder("KK677 1", getHandTypeJoker);
    const expected2 = {
      cards: [Cards.K, Cards.K, Cards.Six, Cards.Seven, Cards.Seven],
      type: HandTypes.TwoPair,
      bid: 1,
    };
    expect(actual2).toEqual(expected2);

    const actual3 = handBuilder("T55J5 1", getHandTypeJoker);
    const expected3 = {
      cards: [Cards.Ten, Cards.Five, Cards.Five, Cards.J, Cards.Five],
      type: HandTypes.FourOfAKind,
      bid: 1,
    };
    expect(actual3).toEqual(expected3);

    const actual4 = handBuilder("QQQJA 1", getHandTypeJoker);
    const expected4 = {
      cards: [Cards.Q, Cards.Q, Cards.Q, Cards.J, Cards.A],
      type: HandTypes.FourOfAKind,
      bid: 1,
    };
    expect(actual4).toEqual(expected4);

    const actual5 = handBuilder("KTJJT 1", getHandTypeJoker);
    const expected5 = {
      cards: [Cards.K, Cards.Ten, Cards.J, Cards.J, Cards.Ten],
      type: HandTypes.FourOfAKind,
      bid: 1,
    };
    expect(actual5).toEqual(expected5);

  });
});
