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

export function filterPotentialLeaves(
  leaves: Node[],
  expectedSequence: string
): Node[] {
  const result = [];
  for (let leaf of leaves) {
    if (
      leaf.failuresSequence.toString() ===
      expectedSequence.substring(0, leaf.failuresSequence.toString().length)
    ) {
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
  expectedSequence: string
): [Node, Node[]] {
  inputString = inputString.concat(".");
  const root: Node = {
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

export const findFinalSequences = (leaves: Node[]): string[] => {
  const finalSequences: string[] = [];
  for (let leaf of leaves) {
    finalSequences.push(leaf.failuresSequence.toString());
  }
  return finalSequences;
};

function firstPuzzleResolver(filePath: string) {
  const inputLines: string[] = syncReadFile(filePath).filter(
    (line) => line.length > 0
  );
  let result = 0;
  for (let inputLine of inputLines) {
    const fieldMap = inputLine.split(" ")[0];
    const expectedSequence = inputLine.split(" ")[1];
    const [root, leaves] = buildTree(fieldMap, expectedSequence);
    result += findFinalSequences(leaves).filter(
      (sequence) => sequence === expectedSequence
    ).length;
  }
  console.log("12: First puzzle: ", result);
}

firstPuzzleResolver("12/input.txt");
