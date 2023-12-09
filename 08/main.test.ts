import {
  LeftRight,
  Node,
  allCurrentNodesEndsInZ,
  buildDirectionSequence,
  buildNodeMap,
  extractNodeString,
  getAllStartingNodes,
} from "./main";

describe("08", () => {
  it("extractNodeString", () => {
    expect(extractNodeString("AAA = (BBB, CCC)")).toEqual([
      "AAA",
      "BBB",
      "CCC",
    ]);
  });

  it("buildNodeMap", () => {
    // given
    const inputLines: string[] = [
      "AAA = (BBB, BBB)",
      "BBB = (AAA, ZZZ)",
      "ZZZ = (ZZZ, ZZZ)",
    ];

    // when
    const result: Map<string, Node> = buildNodeMap(inputLines);

    // then
    const nodeZZZ: Node = { name: "ZZZ" };
    nodeZZZ.left = nodeZZZ;
    nodeZZZ.right = nodeZZZ;
    const nodeBBB: Node = { name: "BBB", right: nodeZZZ };
    nodeBBB.left = nodeBBB;
    const nodeAAA: Node = { name: "AAA", left: nodeBBB, right: nodeBBB };
    nodeBBB.left = nodeAAA;
    const expected: Map<string, Node> = new Map<string, Node>([
      ["AAA", nodeAAA],
      ["BBB", nodeBBB],
      ["ZZZ", nodeZZZ],
    ]);
    expect(result).toEqual(expected);
  });

  it("buildDirectionSequence", () => {
    expect(buildDirectionSequence("LRL")).toEqual([
      LeftRight.Left,
      LeftRight.Right,
      LeftRight.Left,
    ]);
  });

  it("getAllStartingNodes", () => {
    expect(
      getAllStartingNodes([
        "11A = (11B, XXX)",
        "11B = (XXX, 11Z)",
        "11Z = (11B, XXX)",
        "22A = (22B, XXX)",
        "22B = (22C, 22C)",
        "22C = (22Z, 22Z)",
        "22Z = (22B, 22B)",
        "XXX = (XXX, XXX)",
      ])
    ).toEqual(["11A", "22A"]);
  });

  it("allCurrentNodesEndsInZ true", () => {
    expect(allCurrentNodesEndsInZ([{ name: "11Z" }, { name: "21Z" }])).toEqual(
      true
    );
  });

  it("allCurrentNodesEndsInZ false", () => {
    expect(
      allCurrentNodesEndsInZ([
        { name: "11Z" },
        { name: "21Z" },
        { name: "2Z1" },
      ])
    ).toEqual(true);
  });
});
