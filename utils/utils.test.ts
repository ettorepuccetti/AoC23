import { multiplyByScalarMatrix, sumMatrices } from "./utils";

describe("utils", () => {
  it("sumMatrices", () => {
    const matrix1 = [
      [0, 2, 3],
      [1, 0, 4],
      [5, 0, 7],
    ];
    const matrix2 = [
      [3, 4, 3],
      [4, 1, 0],
      [0, 0, 7],
    ];
    const expected = [
      [3, 6, 6],
      [5, 1, 4],
      [5, 0, 14],
    ];
    expect(sumMatrices(matrix1, matrix2)).toEqual(expected);
  });

  it("multiplyByScalarMatrix", () => {
    const matrix = [
      [0, 2, 3, 3],
      [1, 0, 4, 1],
      [5, 6, 7, 0],
    ];
    const scalar = 10;
    const expected = [
      [0, 20, 30, 30],
      [10, 0, 40, 10],
      [50, 60, 70, 0],
    ];
    expect(multiplyByScalarMatrix(matrix, scalar)).toEqual(expected);
  });
});
