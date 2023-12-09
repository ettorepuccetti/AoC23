import { syncReadFile } from "../utils/utils";

export enum LeftRight {
  Left = "L",
  Right = "R",
}

const ROOT_NODE = "AAA";
const DEST_NODE = "ZZZ";

function getLeftRightFromString(str: string): LeftRight {
  switch (str) {
    case "L":
      return LeftRight.Left;
    case "R":
      return LeftRight.Right;
    default:
      throw new Error("Invalid input");
  }
}

export interface Node {
  name: string;
  left?: Node;
  right?: Node;
}

export function extractNodeString(inputLine: string): [string, string, string] {
  const nodeName = inputLine.split(" = ")[0];
  const nodeLeft = inputLine.substring(7, 10);
  const nodeRight = inputLine.substring(12, 15);
  return [nodeName, nodeLeft, nodeRight];
}

export function buildNodeMap(inputLines: string[]): Map<string, Node> {
  const nodeMap: Map<string, Node> = new Map<string, Node>();

  for (const inputLine of inputLines) {
    const [nodeName, nodeLeft, nodeRight] = extractNodeString(inputLine);

    // if left and right nodes don't exist in the map, add them
    if (!nodeMap.has(nodeLeft)) {
      nodeMap.set(nodeLeft, { name: nodeLeft });
    }
    if (!nodeMap.has(nodeRight)) {
      nodeMap.set(nodeRight, { name: nodeRight });
    }
    // get the node from the map if it exists, otherwise create a new one
    let node: Node = nodeMap.has(nodeName)
      ? nodeMap.get(nodeName)!
      : { name: nodeName };
    // set the left and right nodes, already set in the map
    node.left = nodeMap.get(nodeLeft);
    node.right = nodeMap.get(nodeRight);
    nodeMap.set(nodeName, node);
  }
  return nodeMap;
}

export function buildDirectionSequence(inputline: string): LeftRight[] {
  const directionSequence: LeftRight[] = [];

  for (let i = 0; i < inputline.length; i++) {
    const direction: LeftRight = getLeftRightFromString(inputline[i]);
    directionSequence.push(direction);
  }

  return directionSequence;
}

export function getNextNode(node: Node, direction: LeftRight): Node {
  return direction === LeftRight.Left ? node.left! : node.right!;
}

export function firstPuzzleResolver(filePath: string): void {
  const inputLines: string[] = syncReadFile(filePath);
  const directionSequence: LeftRight[] = buildDirectionSequence(inputLines[0]);
  const nodeMap: Map<string, Node> = buildNodeMap(inputLines);

  let moves = 0;
  let directionIndex = 0;
  let currentNode: Node = nodeMap.get(ROOT_NODE)!;

  while (currentNode.name !== DEST_NODE) {
    const direction: LeftRight =
      directionSequence[directionIndex % directionSequence.length];
    currentNode = getNextNode(currentNode, direction);
    directionIndex++;
    moves++;
  }

  console.log("08: First puzzle:", moves);
}

export function getAllStartingNodes(inputLines: string[]): string[] {
  const startingNodes: string[] = [];
  for (let line of inputLines) {
    const [nodeName, nodeLeft, nodeRight] = extractNodeString(line);
    if (nodeName.endsWith("A")) {
      startingNodes.push(nodeName);
    }
  }
  return startingNodes;
}

export function allCurrentNodesEndsInZ(currentNodes: Node[]): boolean {
  for (let node of currentNodes) {
    if (!node.name.endsWith("Z")) {
      return false;
    }
  }
  return true;
}

function secondPuzzleSolver(filePath: string): void {
  const inputLines: string[] = syncReadFile(filePath);
  const directionSequence: LeftRight[] = buildDirectionSequence(inputLines[0]);
  const nodeMap: Map<string, Node> = buildNodeMap(inputLines);

  let moves = 0;
  let directionIndex = 0;
  let currentNodes: Node[] = getAllStartingNodes(inputLines).map(
    (nodeName: string) => nodeMap.get(nodeName)!
  );

  while (!allCurrentNodesEndsInZ(currentNodes)) {
    const direction: LeftRight =
      directionSequence[directionIndex % directionSequence.length];
    const nextCurrentNodes: Node[] = [];
    currentNodes.forEach((node: Node) => {
      nextCurrentNodes.push(getNextNode(node, direction));
    });
    currentNodes = nextCurrentNodes;
    directionIndex++;
    moves++;
    if (moves % 100000000 === 0) {
      console.log("current moves (M):", moves % 1000000);
    }
  }

  console.log("08: Second puzzle:", moves);
}

firstPuzzleResolver("08/input.txt");
secondPuzzleSolver("08/input.toy.txt");
