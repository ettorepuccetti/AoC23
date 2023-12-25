import { syncReadFile } from "../utils/utils";

export interface Node {
  enteringCost: number;
  pi: number;
  i: number;
  j: number;
  previous?: Node;
  straightLineHorizontal: number;
  straightLineVertical: number;
}

export class PriorityQueue {
  private queue: Node[] = [];
  private alreadyExtractedNodes: [number, number, number, number][] = [];

  public extractMin() {
    const extracted = this.queue.shift();

    if (!extracted) {
      throw new Error("Priority queue is empty");
    }

    this.alreadyExtractedNodes.push([
      extracted.i,
      extracted.j,
      extracted.straightLineHorizontal,
      extracted.straightLineVertical,
    ]);
    return extracted;
  }

  public insert(node: Node) {
    this.queue.push(node);
    this.queue.sort((a, b) => a.pi - b.pi);
  }

  public isEmpty() {
    return this.queue.length === 0;
  }

  public alreadyExtracted(neighbor: Node) {
    for (let [i, j, straightLineHorizontal, straightLineVertical] of this
      .alreadyExtractedNodes) {
      if (
        neighbor.i === i &&
        neighbor.j === j &&
        neighbor.straightLineHorizontal >= straightLineHorizontal &&
        neighbor.straightLineVertical >= straightLineVertical
      ) {
        return true;
      }
    }
    return false;
  }
}

export function checkStraightLineExceeded(
  node: Node,
  iNeighbor: number,
  jNeighbor: number
): boolean {
  const MAX_STRAIGHT_LINE = 3;
  const newStraightLineHorizontal =
    node.straightLineHorizontal + (node.i === iNeighbor ? 1 : 0);
  const newStraightLineVertical =
    node.straightLineVertical + (node.j === jNeighbor ? 1 : 0);

  if (
    newStraightLineHorizontal > MAX_STRAIGHT_LINE ||
    newStraightLineVertical > MAX_STRAIGHT_LINE
  ) {
    return true;
  }
  return false;
}

export function neighborIsAncestor(
  node: Node,
  iNeighbor: number,
  jNeighbor: number
): boolean {
  let ancestor = node.previous;
  while (ancestor) {
    if (ancestor.i === iNeighbor && ancestor.j === jNeighbor) {
      return true;
    }
    ancestor = ancestor.previous;
  }
  return false;
}

export class Graph {
  graph: Node[][] = [];
  costMatrix: number[][] = [];
  shortestPath: Node[] = [];

  constructor(inputLines: string[]) {
    this.costMatrix = inputLines.map((line) =>
      line.split("").map((num) => parseInt(num))
    );
  }

  getStartingNode(): Node {
    return {
      enteringCost: this.costMatrix[0][0],
      pi: this.costMatrix[0][0],
      i: 0,
      j: 0,
      straightLineHorizontal: 0,
      straightLineVertical: 0,
    };
  }

  getNeighbors(node: Node): Node[] {
    const neighbors: Node[] = [];
    const { i, j } = node;

    //last node
    if (
      i === this.costMatrix.length - 1 &&
      j === this.costMatrix[0].length - 1
    ) {
      return [];
    }

    for (let [iNeighbor, jNeighbor] of [
      [i + 1, j],
      [i - 1, j],
      [i, j + 1],
      [i, j - 1],
    ]) {
      //exclude previous node
      if (iNeighbor === node.previous?.i && jNeighbor === node.previous?.j) {
        continue;
      }
      // row out of bounds
      if (iNeighbor < 0 || iNeighbor >= this.costMatrix.length) {
        continue;
      }
      // column out of bounds
      if (jNeighbor < 0 || jNeighbor >= this.costMatrix[0].length) {
        continue;
      }
      // exclude straight line
      if (checkStraightLineExceeded(node, iNeighbor, jNeighbor)) {
        continue;
      }
      // exclude ancestor of this path
      if (neighborIsAncestor(node, iNeighbor, jNeighbor)) {
        continue;
      }
      neighbors.push({
        i: iNeighbor,
        j: jNeighbor,
        enteringCost: this.costMatrix[iNeighbor][jNeighbor],
        pi: node.pi + this.costMatrix[iNeighbor][jNeighbor],
        previous: node,
        straightLineHorizontal:
          iNeighbor === i ? node.straightLineHorizontal + 1 : 0,
        straightLineVertical:
          jNeighbor === j ? node.straightLineVertical + 1 : 0,
      });
    }
    return neighbors;
  }

  dijkstra(): Node {
    //initialize
    const startNode: Node = this.getStartingNode();
    startNode.pi = 0;
    const priorityQueue: PriorityQueue = new PriorityQueue();
    priorityQueue.insert(startNode);

    let revisitedNodesCount: number = 0;
    let recomputeNodesCount: number = 0;
    let destinationNode: Node | undefined = undefined;
    //compute shortest path
    while (!destinationNode) {
      const extracted = priorityQueue.extractMin()!;
      recomputeNodesCount++;

      // arrived at the end
      if (
        extracted.i === this.costMatrix.length - 1 &&
        extracted.j === this.costMatrix[0].length - 1
      ) {
        destinationNode = extracted;
      }

      for (let neighbor of this.getNeighbors(extracted)) {
        if (priorityQueue.alreadyExtracted(neighbor)) {
          revisitedNodesCount++;
          continue;
        }
        priorityQueue.insert(neighbor);
      }
    }
    console.log("revisitedNodesCount", revisitedNodesCount);
    console.log("recomputeNodesCount", recomputeNodesCount);
    return destinationNode;
  }

  collectShortestPath(): void {
    //retrieve shortest path
    let lastNode = this.dijkstra();
    while (lastNode.previous) {
      this.shortestPath.push(lastNode);
      lastNode = lastNode.previous;
    }
  }

  getShortestPathCost(): number {
    if (this.shortestPath.length === 0) {
      this.collectShortestPath();
    }
    return this.shortestPath.reduce((acc, node) => acc + node.enteringCost, 0);
  }

  printShortestPath(): void {
    if (this.shortestPath.length === 0) {
      this.collectShortestPath;
    }
    this.costMatrix.forEach((row, indexI) =>
      console.log(
        row
          .map((num, indexJ) => {
            const node = this.shortestPath.find(
              (node) => node.i === indexI && node.j === indexJ
            );
            if (node) {
              return "X";
            }
            return num;
          })
          .join("")
      )
    );
  }
}

function firstPuzzleSolver(filePath: string) {
  const inputLines = syncReadFile(filePath).filter((line) => line !== "");
  const inputGraph: Graph = new Graph(inputLines);
  console.log(inputGraph.getShortestPathCost());
  // inputGraph.printShortestPath();
}

const now: number = Date.now();
firstPuzzleSolver("17/input.txt");
console.log("time:", (Date.now() - now) / 1000, "seconds");
