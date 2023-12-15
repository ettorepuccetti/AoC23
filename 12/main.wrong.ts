import { assert } from "console";
import { syncReadFile } from "../utils/utils";

export interface Node {
  value: string;
  inProgressFailures: number;
  failuresSequence: number[];
  childWorking: Node | null;
  childFailure: Node | null;
}

export function findLeaves(tree: Node): Node[] {
  const leaves: Node[] = [];
  if (tree.childFailure === null && tree.childWorking === null) {
    leaves.push(tree);
  } else {
    if (tree.childFailure) {
      leaves.push(...findLeaves(tree.childFailure));
    }
    if (tree.childWorking) {
      leaves.push(...findLeaves(tree.childWorking));
    }
  }
  return leaves;
}

export function appendFailure(leaf: Node) {
  const newLeaf: Node = {
    value: "#",
    inProgressFailures: leaf.inProgressFailures + 1,
    failuresSequence: leaf.failuresSequence,
    childWorking: null,
    childFailure: null,
  };
  leaf.childFailure = newLeaf;
  return newLeaf;
}

export function appendWorking(leaf: Node) {
  let newFailuresSequence: number[];

  if (leaf.inProgressFailures > 0) {
    assert(leaf.value === "#");
    newFailuresSequence = leaf.failuresSequence.concat(leaf.inProgressFailures);
  } else {
    assert(leaf.value === ".");
    newFailuresSequence = leaf.failuresSequence;
  }
  const newLeaf: Node = {
    value: ".",
    inProgressFailures: 0,
    failuresSequence: newFailuresSequence,
    childWorking: null,
    childFailure: null,
  };

  leaf.childWorking = newLeaf;
  return newLeaf;
}

export function isStillValidSequence(
  failuresSequence: number[],
  expectedSequence: string
): boolean {
  return (
    failuresSequence.toString() ===
    expectedSequence.substring(0, failuresSequence.toString().length)
  );
}

export function filterPotentialLeaves(
  leaves: Node[],
  expectedSequence: string
): Node[] {
  const result = [];
  for (let leaf of leaves) {
    if (isStillValidSequence(leaf.failuresSequence, expectedSequence)) {
      result.push(leaf);
    }
  }
  return result;
}

export const processChar = (
  char: string,
  node: Node,
  expectedSequence: string
): Node[] => {
  const newLeaves: Node[] = [];
  if (char === ".") {
    newLeaves.push(appendWorking(node));
  }
  if (char === "#") {
    newLeaves.push(appendFailure(node));
  }

  if (char === "?") {
    newLeaves.push(appendWorking(node));
    newLeaves.push(appendFailure(node));
  }
  return filterPotentialLeaves(newLeaves, expectedSequence);
};

export function buildTree(
  inputString: string,
  expectedSequence: string,
  inputRoot?: Node
): [Node, Node[]] {
  inputString = inputString.concat(".");
  const root: Node = inputRoot ?? {
    value: ".",
    inProgressFailures: 0,
    failuresSequence: [],
    childWorking: null,
    childFailure: null,
  };

  let leaves: Node[] = [root];

  for (let char of inputString) {
    let newLeaves: Node[] = [];
    for (let leaf of leaves) {
      newLeaves = newLeaves.concat(processChar(char, leaf, expectedSequence));
    }
    leaves = newLeaves;
  }

  return [root, leaves];
}

function firstPuzzleResolver(filePath: string) {
  const inputLines: string[] = syncReadFile(filePath).filter(
    (line) => line.length > 0
  );
  let result = 0;
  for (let inputLine of inputLines) {
    const fieldMap = inputLine.split(" ")[0];
    const expectedSequence = inputLine.split(" ")[1];
    const [root, leaves] = buildTree(fieldMap, expectedSequence);
    result += countMatchingSequences(leaves, expectedSequence);
  }
  console.log("12: First puzzle: ", result);
}

const root: Node = {
  value: ".",
  inProgressFailures: 0,
  failuresSequence: [],
  childWorking: null,
  childFailure: null,
};

export function repeatSequence(sequence: string, repetitions: number): string {
  return (sequence + ",").repeat(repetitions).slice(0, -1);
}

export function buildRepeatedTree(
  inputLine: string,
  expectedSequence: string,
  repetitions: number
): [Node, Node[]] {
  let leavesOfSubstring: Node[] = [{ ...root }];

  const levelExpectedSequence = repeatSequence(expectedSequence, repetitions);

  for (let index of Array.from(Array(repetitions).keys())) {
    const levelInputLine =
      index < repetitions - 1 ? inputLine + "?" : inputLine;

    const newLeavesOfSubstring: Node[] = [];
    for (let leaf of leavesOfSubstring) {
      let [_root, leaves] = buildTree(
        levelInputLine,
        levelExpectedSequence,
        leaf
      );
      // filtering leaves that still have expected sequence overall
      leaves = leaves.filter((leaf) =>
        isStillValidSequence(leaf.failuresSequence, levelExpectedSequence)
      );
      newLeavesOfSubstring.push(...leaves);
    }
    leavesOfSubstring = newLeavesOfSubstring;
  }
  return [root, leavesOfSubstring];
}

export function countMatchingSequences(
  leaves: Node[],
  expectedSequence: string
): number {
  return leaves.filter(
    (leaf) => leaf.failuresSequence.toString() === expectedSequence
  ).length;
}

function secondPuzzleResolver(filePath: string) {
  const REPETITIONS = 5;
  const inputLines: string[] = syncReadFile(filePath).filter(
    (line) => line.length > 0
  );
  let result = 0;
  for (let [index, inputLine] of inputLines.entries()) {
    console.log("PROCESSING LINE", index);
    const [inputSequence, expectedSequence] = inputLine.split(" ");

    const [_root, leavesOfFinalLevel]: [Node, Node[]] = buildRepeatedTree(
      inputSequence,
      expectedSequence,
      REPETITIONS
    );

    result += countMatchingSequences(
      leavesOfFinalLevel,
      repeatSequence(expectedSequence, REPETITIONS)
    );
  }
  console.log("12: Second puzzle: ", result);
}

// firstPuzzleResolver("12/input.toy.txt");
// secondPuzzleResolver("12/input.txt");
