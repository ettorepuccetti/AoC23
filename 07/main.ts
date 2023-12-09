import { syncReadFile } from "../utils/utils";

export enum Cards {
  A = 14,
  K = 13,
  Q = 12,
  J = 11,
  Ten = 10,
  Nine = 9,
  Eight = 8,
  Seven = 7,
  Six = 6,
  Five = 5,
  Four = 4,
  Three = 3,
  Two = 2,
}

export function fromCharToCard(char: string): Cards {
  switch (char) {
    case "A":
      return Cards.A;
    case "K":
      return Cards.K;
    case "Q":
      return Cards.Q;
    case "J":
      return Cards.J;
    case "T":
      return Cards.Ten;
    case "9":
      return Cards.Nine;
    case "8":
      return Cards.Eight;
    case "7":
      return Cards.Seven;
    case "6":
      return Cards.Six;
    case "5":
      return Cards.Five;
    case "4":
      return Cards.Four;
    case "3":
      return Cards.Three;
    case "2":
      return Cards.Two;
    default:
      throw new Error("Invalid card");
  }
}

export function compareCardsNormal(a: Cards, b: Cards) {
  return a - b;
}

export enum HandTypes {
  FiveOfAKind = 6,
  FourOfAKind = 5,
  FullHouse = 4,
  ThreeOfAKind = 3,
  TwoPair = 2,
  OnePair = 1,
  HighCard = 0,
}

export interface Hand {
  cards: Cards[];
  type: HandTypes;
  bid: number;
}

export function compareHands(
  h1: Hand,
  h2: Hand,
  cardComparator: (a: Cards, b: Cards) => number
) {
  if (h1.type !== h2.type) {
    return h1.type - h2.type;
  }
  let i = 0;
  while (i < h1.cards.length) {
    if (h1.cards[i] !== h2.cards[i]) {
      return cardComparator(h1.cards[i], h2.cards[i]);
    }
    i++;
  }
  throw new Error("Hands are equal");
}

export function getHandTypeNormal(cards: Cards[]): HandTypes {
  const map: Map<Cards, number> = new Map();
  for (let i = 0; i < cards.length; i++) {
    map.has(cards[i])
      ? map.set(cards[i], map.get(cards[i])! + 1)
      : map.set(cards[i], 1);
  }
  const length = Array.from(map.keys()).length;
  const higherOccurrence = Math.max(...Array.from(map.values()));
  if (length === 1) return HandTypes.FiveOfAKind;
  if (length === 2 && higherOccurrence === 4) return HandTypes.FourOfAKind;
  if (length === 2 && higherOccurrence === 3) return HandTypes.FullHouse;
  if (length === 3 && higherOccurrence === 3) return HandTypes.ThreeOfAKind;
  if (length === 3 && higherOccurrence === 2) return HandTypes.TwoPair;
  if (length === 4 && higherOccurrence === 2) return HandTypes.OnePair;
  if (length === 5) return HandTypes.HighCard;

  console.error({ cards, map, length, higherOccurrence });
  throw new Error("Invalid hand");
}

export function cardsBuilder(cardsString: string): Cards[] {
  const cards: Cards[] = [];
  for (let cardString of cardsString) {
    cards.push(fromCharToCard(cardString));
  }
  return cards;
}

export function handBuilder(
  handString: string,
  handTypeBuilder: (cards: Cards[]) => HandTypes
): Hand {
  const cards: Cards[] = cardsBuilder(handString.split(" ")[0]);
  const type = handTypeBuilder(cards);
  const bid = parseInt(handString.split(" ")[1]);

  return {
    cards,
    type,
    bid,
  };
}

function firstPuzzleSolver(filePath: string) {
  const lines = syncReadFile(filePath).slice(0, -1);
  const sortedHands = lines
    .map((line) => handBuilder(line, getHandTypeNormal))
    .sort((h1: Hand, h2: Hand) => compareHands(h1, h2, compareCardsNormal));
  const result = sortedHands.reduce(
    (acc, currHand, index) => currHand.bid * (index + 1) + acc,
    0
  );
  console.log(result);
  return result;
}

export function getHandTypeJoker(cards: Cards[]): HandTypes {
  const map: Map<Cards, number> = new Map();
  let numberOfJokers: number = 0;
  for (let i = 0; i < cards.length; i++) {
    if (cards[i] === Cards.J) {
      numberOfJokers++;
      continue;
    }
    map.has(cards[i])
      ? map.set(cards[i], map.get(cards[i])! + 1)
      : map.set(cards[i], 1);
  }

  // apply the jokers as if they were the most present card
  let mostPresentCard: Cards;
  let maxOccurence = 0;
  for (let [card, occurence] of map.entries()) {
    if (occurence > maxOccurence) {
      maxOccurence = occurence;
      mostPresentCard = card;
    }
  }
  map.set(mostPresentCard!, map.get(mostPresentCard!)! + numberOfJokers);

  // calculate as normal
  const length = Array.from(map.keys()).length;
  const higherOccurrence = Math.max(...Array.from(map.values()));

  if (length === 1) return HandTypes.FiveOfAKind;
  if (length === 2 && higherOccurrence === 4) return HandTypes.FourOfAKind;
  if (length === 2 && higherOccurrence === 3) return HandTypes.FullHouse;
  if (length === 3 && higherOccurrence === 3) return HandTypes.ThreeOfAKind;
  if (length === 3 && higherOccurrence === 2) return HandTypes.TwoPair;
  if (length === 4 && higherOccurrence === 2) return HandTypes.OnePair;
  if (length === 5) return HandTypes.HighCard;

  throw new Error("Invalid hand");
}

function compareCardsJoker(a: Cards, b: Cards): number {
  const firstCard = a === Cards.J ? 1 : a;
  const secondCard = b === Cards.J ? 1 : b;
  return firstCard - secondCard;
}

export function secondPuzzleSolver(filePath: string) {
  const lines = syncReadFile(filePath).slice(0, -1);
  const sortedHands = lines
    .map((line) => handBuilder(line, getHandTypeJoker))
    .sort((h1: Hand, h2: Hand) => compareHands(h1, h2, compareCardsJoker));

  const result = sortedHands.reduce(
    (acc, currHand, index) => currHand.bid * (index + 1) + acc,
    0
  );
  console.log(result);
  return result;
}

firstPuzzleSolver("07/input.txt");
secondPuzzleSolver("07/input.txt");
