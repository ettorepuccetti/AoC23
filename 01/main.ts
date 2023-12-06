import { processFile } from "../utils/utils.js";

async function main(filePath: string) {
  processFile(filePath, firstPuzzleSolver, secondPuzzleSolver);
}

function firstPuzzleSolver(line: string) {
  let firstNumber: number;
  for (let i = 0; i < line.length; i++) {
    if (!Number.isNaN(parseInt(line[i]))) {
      firstNumber = parseInt(line[i]);
      break;
    }
  }

  let secondNumber: number;
  for (let i = line.length - 1; i >= 0; i--) {
    if (!Number.isNaN(parseInt(line[i]))) {
      secondNumber = parseInt(line[i]);
      break;
    }
  }

  return 10 * firstNumber! + secondNumber!;
}

const stringToDigit = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

function secondPuzzleSolver(line: string) {
  // build the object {indexAt: "string"}, considering also multiple matches for same string
  // es: for input "eightwothreetwo7abc" -> { '0': 'eight', '4': 'two', '7': 'three','12': 'two' }
  let indexStartingStrings: { [key: number]: string } = {};
  Object.keys(stringToDigit).forEach((stringDigit) => {
    const indexes: (number | undefined)[] = [
      ...line.matchAll(new RegExp(stringDigit, "gi")),
    ].map((a) => a.index);

    indexes.forEach((index) => {
      if (index === undefined) return;
      indexStartingStrings[index] = stringDigit;
    });
  });

  // getting starting index of first and last string represent digits
  // "eightwothreetwo7abc" -> 0, 12
  const firstStringPosition = parseInt(Object.keys(indexStartingStrings)[0]);
  const lastStringPosition = parseInt(
    Object.keys(indexStartingStrings).at(-1)!
  );

  // getting first and last number from string represent digits
  // "eightwothreetwo7abc" -> eight, two
  const firstString = indexStartingStrings[firstStringPosition];
  const lastString = indexStartingStrings[lastStringPosition];

  // converting to numbers
  // eight, two -> 8, 2
  const firstNumberFromString =
    stringToDigit[firstString as keyof typeof stringToDigit];

  const lastNumberFromString =
    stringToDigit[lastString as keyof typeof stringToDigit];

  // getting first and last number as digits, and their position
  // "eightwothreetwo7abc" -> 7 at index 15, 7 at index 15 (first and last are the same here)
  let firstDigitPosition: number;
  let firstNumberFromDigit: number;
  for (let i: number = 0; i < line.length; i++) {
    if (!Number.isNaN(parseInt(line[i]))) {
      firstDigitPosition = i;
      firstNumberFromDigit = parseInt(line[i]);
      break;
    }
  }

  let lastDigitPosition;
  let lastNumberFromDigit;
  for (let i = line.length - 1; i >= 0; i--) {
    if (!Number.isNaN(parseInt(line[i]))) {
      lastDigitPosition = i;
      lastNumberFromDigit = parseInt(line[i]);
      break;
    }
  }

  // if there are no numbers from string I return the result from digits
  if (firstNumberFromString === undefined) {
    return 10 * firstNumberFromDigit! + lastNumberFromDigit!;
  }

  // check if occur first the string or the digit,
  //if `firstDigitPosition` is undefined, check is false and return `firstNumberFromString`
  const firstNumber =
    firstDigitPosition! < firstStringPosition
      ? firstNumberFromDigit!
      : firstNumberFromString;

  // check if occur last the string or the digit
  const lastNumber =
    lastDigitPosition! > lastStringPosition
      ? lastNumberFromDigit
      : lastNumberFromString;

  return 10 * firstNumber + lastNumber!;
}

main("01/input.txt");
