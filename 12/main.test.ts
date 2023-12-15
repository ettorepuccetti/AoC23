import {
  Node,
  appendFailure,
  appendWorking,
  buildRepeatedTree,
  buildTree,
  countMatchingSequences,
  filterPotentialLeaves,
  findLeaves,
  processChar,
  repeatSequence,
} from "./main.wrong";
import { Solver, repeatGroups, repeatSpringRow } from "./main";

describe("12", () => {
  it("array", () => {
    expect([1, 2, 3].concat(4)).toEqual([1, 2, 3, 4]);
  });

  it("appendFailure after working", () => {
    //given
    const node: Node = {
      value: ".",
      inProgressFailures: 0,
      failuresSequence: [1, 2],
      childWorking: null,
      childFailure: null,
    };
    //when
    const newLeaf = appendFailure(node);

    // then
    const expected: Node = {
      value: "#",
      inProgressFailures: 1,
      failuresSequence: [1, 2],
      childWorking: null,
      childFailure: null,
    };
    expect(node.childFailure).toEqual(expected);
    expect(newLeaf).toEqual(expected);
  });

  it("appendFailure after failure", () => {
    //given
    const node: Node = {
      value: "#",
      inProgressFailures: 1,
      failuresSequence: [2, 6],
      childWorking: null,
      childFailure: null,
    };
    //when
    const newLeaf = appendFailure(node);

    // then
    const expected: Node = {
      value: "#",
      inProgressFailures: 2,
      failuresSequence: [2, 6],
      childWorking: null,
      childFailure: null,
    };
    expect(node.childFailure).toEqual(expected);
    expect(newLeaf).toEqual(expected);
  });

  it("appendWorking after working", () => {
    //given
    const node: Node = {
      value: ".",
      inProgressFailures: 0,
      failuresSequence: [1, 2],
      childWorking: null,
      childFailure: null,
    };
    //when
    const newLeaf = appendWorking(node);

    // then - same node
    expect(node.childWorking).toEqual({
      ...node,
      childFailure: null,
      childWorking: null,
    });
    expect(newLeaf).toEqual({
      ...node,
      childFailure: null,
      childWorking: null,
    });
  });

  it("appendWorking after failure", () => {
    //given
    const node: Node = {
      value: "#",
      inProgressFailures: 3,
      failuresSequence: [1, 2],
      childWorking: null,
      childFailure: null,
    };
    //when
    const newLeaf = appendWorking(node);

    // then
    const expected: Node = {
      value: ".",
      inProgressFailures: 0,
      failuresSequence: [1, 2, 3],
      childWorking: null,
      childFailure: null,
    };
    expect(node.childWorking).toEqual(expected);
    expect(newLeaf).toEqual(expected);
  });

  it("findLeaves", () => {
    //given
    const leaf2: Node = {
      value: "#",
      inProgressFailures: 2,
      failuresSequence: [],
      childWorking: null,
      childFailure: null,
    };
    const leaf1: Node = {
      value: ".",
      inProgressFailures: 0,
      failuresSequence: [],
      childWorking: null,
      childFailure: null,
    };
    const child2: Node = {
      value: "#",
      inProgressFailures: 1,
      failuresSequence: [],
      childWorking: null,
      childFailure: leaf2,
    };
    const root: Node = {
      value: ".",
      inProgressFailures: 0,
      failuresSequence: [],
      childWorking: leaf1,
      childFailure: child2,
    };

    //when then
    expect(findLeaves(root)).toContainEqual(leaf1);
    expect(findLeaves(root)).toContainEqual(leaf2);
    expect(findLeaves(root)).not.toContainEqual(child2);
    expect(findLeaves(root)).not.toContainEqual(root);
  });

  it("filterPotentialLeaves complaint", () => {
    const complainingLeaf: Node = {
      childFailure: null,
      childWorking: null,
      failuresSequence: [1, 11, 3],
      inProgressFailures: 0,
      value: ".",
    };

    expect(filterPotentialLeaves([complainingLeaf], "1,11,3")).toContainEqual(
      complainingLeaf
    );
  });

  it("filterPotentialLeaves complaint partial string", () => {
    const complainingLeaf: Node = {
      childFailure: null,
      childWorking: null,
      failuresSequence: [1, 11],
      inProgressFailures: 0,
      value: ".",
    };

    expect(filterPotentialLeaves([complainingLeaf], "1,11,3")).toContainEqual(
      complainingLeaf
    );
  });

  it("filterPotentialLeaves not compliant", () => {
    const complainingLeaf: Node = {
      childFailure: null,
      childWorking: null,
      failuresSequence: [1, 11, 3],
      inProgressFailures: 0,
      value: ".",
    };

    expect(filterPotentialLeaves([complainingLeaf], "1,11,4")).toEqual([]);
  });

  it("processChar complaining sequence", () => {
    const leafToAppendWorking: Node = {
      value: "#",
      inProgressFailures: 3,
      failuresSequence: [1, 1],
      childWorking: null,
      childFailure: null,
    };
    const newAddedLeaf = processChar(".", leafToAppendWorking, "1,1,3");
    expect(newAddedLeaf).toContainEqual({
      value: ".",
      inProgressFailures: 0,
      failuresSequence: [1, 1, 3],
      childWorking: null,
      childFailure: null,
    });
  });

  it("buildTree", () => {
    //given
    const inputString = "???.###";

    //when
    const [root, leaves] = buildTree(inputString, "1,1,3");
    //then
    expect(leaves).toContainEqual({
      value: ".",
      inProgressFailures: 0,
      failuresSequence: [1, 1, 3],
      childWorking: null,
      childFailure: null,
    });
  });

  it("buildRepeatedTree", () => {
    const [root, actualLeaves] = buildRepeatedTree(".?", "1", 2);
    const prototypeLeaf: Node = {
      value: ".",
      inProgressFailures: 0,
      failuresSequence: [],
      childWorking: null,
      childFailure: null,
    };
    //then
    const expectedLeaves: Node[] = [
      { ...prototypeLeaf, failuresSequence: [1, 1] },
      { ...prototypeLeaf, failuresSequence: [1] },
      { ...prototypeLeaf, failuresSequence: [1, 1] },
      { ...prototypeLeaf, failuresSequence: [1] },
      { ...prototypeLeaf, failuresSequence: [1] },
      { ...prototypeLeaf, failuresSequence: [] },
    ];
    expect(actualLeaves).toHaveLength(expectedLeaves.length);
    expectedLeaves.forEach((expectedLeaf) => {
      expect(actualLeaves).toContainEqual(expectedLeaf);
    });
  });

  it.skip("test toy", () => {
    const inputStrings: { inputLine: string; result: number }[] = [
      { inputLine: "???.### 1,1,3", result: 1 },
      { inputLine: ".??..??...?##. 1,1,3", result: 16384 },
      { inputLine: "?#?#?#?#?#?#?#? 1,3,1,6", result: 1 },
      { inputLine: "????.#...#... 4,1,1", result: 16 },
      { inputLine: "????.######..#####. 1,6,5", result: 2500 },
      { inputLine: "?###???????? 3,2,1", result: 506250 },
    ];
    inputStrings.forEach(({ inputLine, result }) => {
      const [input, expectedSequence] = inputLine.split(" ");
      const [_root, leavesOfFinalLevel]: [Node, Node[]] = buildRepeatedTree(
        input,
        expectedSequence,
        5
      );

      const matchingSequences = countMatchingSequences(
        leavesOfFinalLevel,
        repeatSequence(expectedSequence, 5)
      );
      expect(matchingSequences).toEqual(result);
    });
  });

  it("test toy", () => {
    const inputStrings: {
      inputLine: string;
      groups: number[];
      result: number;
    }[] = [
      { inputLine: "???.###", groups: [1, 1, 3], result: 1 },
      { inputLine: ".??..??...?##.", groups: [1, 1, 3], result: 16384 },
      { inputLine: "?#?#?#?#?#?#?#?", groups: [1, 3, 1, 6], result: 1 },
      { inputLine: "????.#...#...", groups: [4, 1, 1], result: 16 },
      { inputLine: "????.######..#####.", groups: [1, 6, 5], result: 2500 },
      { inputLine: "?###????????", groups: [3, 2, 1], result: 506250 },
    ];
    inputStrings.forEach(({ inputLine, groups, result }) => {
      const solver: Solver = new Solver(
        repeatSpringRow(inputLine, "?", 5),
        repeatGroups(groups, 5)
      );
      expect(solver.findArrangments()).toEqual(result);
    });
  });
});
