import {
  Graph,
  Node,
  PriorityQueue,
  checkStraightLineExceeded,
  neighborIsAncestor,
} from "./main";

const defaultNode: Node = {
  enteringCost: 0,
  pi: 0,
  i: 0,
  j: 0,
  straightLineHorizontal: 0,
  straightLineVertical: 0,
};

describe("17", () => {
  it("checkStraightLineExceeded Horizontal", () => {
    const node: Node = {
      enteringCost: 3,
      pi: 5,
      i: 10,
      j: 10,
      straightLineHorizontal: 3,
      straightLineVertical: 0,
    };
    expect(checkStraightLineExceeded(node, 10, 11)).toBe(true);
    expect(checkStraightLineExceeded(node, 11, 10)).toBe(false);
  });

  it("checkStraightLineExceeded Vertical", () => {
    const node: Node = {
      enteringCost: 3,
      pi: 5,
      i: 10,
      j: 10,
      straightLineHorizontal: 0,
      straightLineVertical: 3,
    };
    expect(checkStraightLineExceeded(node, 10, 11)).toBe(false);
    expect(checkStraightLineExceeded(node, 11, 10)).toBe(true);
  });

  it("checkStraightLineExceeded not exceed", () => {
    const node: Node = {
      enteringCost: 3,
      pi: 5,
      i: 10,
      j: 10,
      straightLineHorizontal: 2,
      straightLineVertical: 2,
    };
    expect(checkStraightLineExceeded(node, 10, 11)).toBe(false);
    expect(checkStraightLineExceeded(node, 11, 10)).toBe(false);
  });

  it("getNeighbors starting node", () => {
    const graph: Graph = new Graph([
      "51111", // prettier-ignore
      "91190",
    ]);

    const neighbors = graph.getNeighbors({
      ...defaultNode,
      i: 0,
      j: 0,
    });
    expect(neighbors.length).toBe(2);
  });

  it("getNeighbors exceededStraightLine", () => {
    const graph: Graph = new Graph([
      "51111", // prettier-ignore
      "91190",
    ]);

    const neighbors = graph.getNeighbors({
      ...defaultNode,
      previous: { ...defaultNode, i: 0, j: 2 },
      i: 0,
      j: 3,
      straightLineHorizontal: 3,
    });
    expect(neighbors.length).toBe(1);
    expect(neighbors[0].i).toBe(1);
    expect(neighbors[0].j).toBe(3);
    expect(neighbors[0].straightLineHorizontal).toBe(0);
  });

  it("getNeighbors not exceededStraightLine", () => {
    const graph: Graph = new Graph([
      "51111", // prettier-ignore
      "91190",
    ]);

    const neighbors = graph.getNeighbors({
      ...defaultNode,
      previous: { ...defaultNode, i: 0, j: 2 },
      i: 0,
      j: 3,
      straightLineHorizontal: 1,
    });
    expect(neighbors.length).toBe(2);

    expect(neighbors[0].i).toBe(1);
    expect(neighbors[0].j).toBe(3);
    expect(neighbors[0].straightLineHorizontal).toBe(0);

    expect(neighbors[1].i).toBe(0);
    expect(neighbors[1].j).toBe(4);
    expect(neighbors[1].straightLineHorizontal).toBe(2);
  });

  it("priorityQueue alreadyExtracted", () => {
    const pq = new PriorityQueue();
    pq.insert({
      ...defaultNode,
      i: 10,
      j: 10,
      straightLineHorizontal: 1,
      straightLineVertical: 0,
      previous: { ...defaultNode, i: 10, j: 9 },
    });
    pq.extractMin();
    expect(
      pq.alreadyExtracted({
        ...defaultNode,
        i: 10,
        j: 10,
        straightLineHorizontal: 1,
        straightLineVertical: 0,
        previous: defaultNode,
      })
    ).toBe(true);
  });

  it("neighborIsAncestor true", () => {
    const extracted: Node = {
      ...defaultNode,
      i: 1,
      j: 1,
      previous: {
        ...defaultNode,
        i: 2,
        j: 1,
        previous: {
          ...defaultNode,
          i: 2,
          j: 0,
          previous: { ...defaultNode, i: 1, j: 0, previous: undefined },
        },
      },
    };
    expect(neighborIsAncestor(extracted, 1, 0)).toBe(true);
  });

  it("neighborIsAncestor false", () => {
    const extracted: Node = {
      ...defaultNode,
      i: 1,
      j: 1,
      previous: {
        ...defaultNode,
        i: 2,
        j: 1,
        previous: {
          ...defaultNode,
          i: 2,
          j: 0,
          previous: { ...defaultNode, i: 1, j: 0, previous: undefined },
        },
      },
    };
    expect(neighborIsAncestor(extracted, 0, 1)).toBe(false);
  });

  it("djikstra minPath", () => {
    const inputGraph: Graph = new Graph([
      "51111", // prettier-ignore
      "91190",
    ]);
    expect(inputGraph.getShortestPathCost()).toBe(6);
  });

  it.only("djikstra minPath", () => {
    const inputGraph: Graph = new Graph([
      "59999", // prettier-ignore
      "11111",
      "11999",
    ]);
    inputGraph.getShortestPathCost();
  });
});
