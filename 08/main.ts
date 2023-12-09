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

function numberOfMovesForDestionation(
  nodeMap: Map<string, Node>,
  directionSequence: LeftRight[],
  startingNode: Node,
  isDestinationNode: (nodeName: string) => boolean
): number {
  let moves = 0;
  let directionIndex = 0;
  let currentNode: Node = startingNode;

  while (!isDestinationNode(currentNode.name)) {
    const direction: LeftRight =
      directionSequence[directionIndex % directionSequence.length];
    currentNode = getNextNode(currentNode, direction);
    directionIndex++;
    moves++;
  }
  return moves;
}

export function firstPuzzleResolver(filePath: string): void {
  const inputLines: string[] = syncReadFile(filePath);
  const directionSequence: LeftRight[] = buildDirectionSequence(inputLines[0]);
  const nodeMap: Map<string, Node> = buildNodeMap(inputLines);

  const moves = numberOfMovesForDestionation(
    nodeMap,
    directionSequence,
    nodeMap.get(ROOT_NODE)!,
    (nodeName: string) => nodeName === DEST_NODE
  );

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

const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);

const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

function secondPuzzleSolver(filePath: string): void {
  const inputLines: string[] = syncReadFile(filePath);
  const directionSequence: LeftRight[] = buildDirectionSequence(inputLines[0]);
  const nodeMap: Map<string, Node> = buildNodeMap(inputLines);

  let currentNodes: Node[] = getAllStartingNodes(inputLines).map(
    (nodeName: string) => nodeMap.get(nodeName)!
  );

  const movesArray: number[] = [];
  for (let node of currentNodes) {
    const moves = numberOfMovesForDestionation(
      nodeMap,
      directionSequence,
      node,
      (nodeName: string) => nodeName.endsWith("Z")
    );
    movesArray.push(moves);
  }

  const totalMoves: number = movesArray.reduce(lcm);
  console.log("08: Second puzzle:", totalMoves);
}

firstPuzzleResolver("08/input.txt");
secondPuzzleSolver("08/input.txt");
