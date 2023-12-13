import {
  Node,
  appendFailure,
  appendWorking,
  buildTree,
  filterPotentialLeaves,
  findFinalSequences,
  findLeaves,
  processChar,
} from "./main";

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

  it("findFinalSequences", () => {
    //given
    const inputString = "???.###";

    //when
    const [root, leaves] = buildTree(inputString, "1,1,3");
    const actual = findFinalSequences(leaves);

    //then
    expect(actual).toContainEqual("1,1,3");
  });
});
