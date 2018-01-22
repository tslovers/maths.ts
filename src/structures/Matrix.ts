/**
 * @author Hector J. Vasquez <ipi.vasquez@gmail.com>
 *
 * @licence
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Node, {ValidNumber} from '../core/Node';
import * as $ from 'jquery';

/**
 * An implementation of a Matrix in mathematics. This matrix may be a matrix
 * of any kind of mathematical expression: number, expression...
 */
export default class Matrix {
  protected matrix: Node[][];

  /**
   * Builds a matrix from the dimensions of the matrix or its representation
   * as an Array or as a Matrix object.
   * @param m May be a the representation of the matrix as an Array or as
   * a Matrix; or, it may be the number of rows for this Matrix.
   * @param n The number of columns of the matrix in case of the first
   * argument (m) is a number.
   */
  constructor(m: ValidNumber[][] | Matrix | number = 1, n: number = 1) {
    if (typeof m === 'number') {
      this.mxnConstructor(m, n);
    } else {
      this.matrixConstructor(m);
    }
  }

  /**
   * Gets the number of rows in this matrix.
   * @return The number of rows in matrix.
   */
  get M(): number {
    return this.matrix.length;
  }

  /**
   * Get the number of columns in this matrix.
   * @return The number of columns in this matrix.
   */
  get N(): number {
    return this.matrix[0].length;
  }

  /**
   * Creates a copy of the matrix this object represents as an array.
   * @return A two dimensional array of which this Matrix is representing.
   */
  get nodeMatrix(): Node[][] {
    return this.matrix.map(row => row.map(Node.newNode));
  }

  /**
   * Creates a copy of the matrix this object represents as a two
   * dimensional array of numbers. If this Matrix contains elements that
   * cannot be converted as numbers (such as expression with variables) it
   * will return an undefined in the element that it did not convert.
   * @return A two dimensional array of numbers of the matrix this object
   * represents.
   */
  get numberMatrix(): number[][] {
    return this.matrix.map(row => row.map(i => i.numberValue));
  }

  /**
   * Creates a two dimensional array of strings representing each element
   * in this Matrix.
   * @return A two dimensional array of each representation of this
   * elements matrix.
   */
  get stringMatrix(): string[][] {
    return this.matrix.map(row => row.map(e => e + ''));
  }

  /**
   * Checks if this is a square matrix.
   * @return true if this is a square matrix, false otherwise.
   */
  get isSquare(): boolean {
    return this.M === this.N;
  }

  /**
   * Generates the transpose of this matrix.
   * @return The transpose of this matrix.
   */
  get transpose(): Matrix {
    const mt = new Matrix(this.N, this.M);

    for (let i = 0; i < mt.M; i++) {
      for (let j = 0; j < mt.N; j++) {
        mt.matrix[i][j] = this.matrix[j][i].clone();
      }
    }

    return mt;
  }

  /**
   * Calculates adj(this).
   * @return The adjucate matrix of this.
   */
  get adjucate(): Matrix {
    if (!this.isSquare) {
      throw new Error('Only a square matrix has adjucate');
    }

    const adj = new Matrix(this.M, this.N);
    for (let i = 0; i < adj.M; i++) {
      for (let j = 0; j < adj.N; j++) {
        if ((i + j) & 1) {
          adj.matrix[i][j] = calcDeterminant(
            subMatrix(this.matrix, j, i)
          ).negate();
        } else {
          adj.matrix[i][j] = calcDeterminant(
            subMatrix(this.matrix, j, i)
          );
        }
      }
    }

    return adj;
  }

  /**
   * Generates the inverse of this matrix.
   * @return This matrix inverse.
   */
  get inverse(): Matrix {
    if (!this.isSquare) {
      throw new Error('Only a square matrix has inverse');
    }

    const inv = this.adjucate;
    const det = this.determinant;
    for (const row of inv.matrix) {
      for (const element of row) {
        element.divideHere(det);
      }
    }

    return inv;
  }

  /**
   * Calculates the determinant of this Matrix recursively.
   */
  get determinant(): Node {
    if (!this.isSquare) {
      throw new Error('Determinant can only be calculated on a square ' +
        ' matrix');
    }
    return calcDeterminant(this.matrix);
  }

  /**
   * Adds this to another matrix in a new Matrix.
   * @param m The matrix to add to this.
   * @return The result of this + m.
   */
  public add(m: Matrix): Matrix {
    if (m.M !== this.M || m.N !== this.N) {
      throw new Error('The sizes of the matrix does not match to' +
        ' execute addition between them.');
    }

    const result = new Matrix(this.M, this.N);

    for (let i = 0; i < this.M; i++) {
      for (let j = 0; j < this.N; j++) {
        result.matrix[i][j] = this.matrix[i][j].add(m.matrix[i][j]);
      }
    }

    return result;
  }

  /**
   * Multiplies this to another matrix in a new Matrix.
   * @param m The matrix to multiply to this.
   * @return The result of this * m.
   */
  public multiply(m: Matrix): Matrix {
    if (this.N !== m.M) {
      throw new Error('The sizes of the matrix does not match to' +
        ' execute multiplication between them.');
    }
    const result: Matrix = new Matrix(this.M, m.N);

    for (let i = 0; i < result.M; i++) {
      for (let j = 0; j < result.N; j++) {
        result.matrix[i][j] = new Node(0);
        for (let k = 0; k < this.N; k++) {
          result.matrix[i][j]
            .addHere(this.matrix[i][k].multiply(m.matrix[k][j]));
        }
      }
    }

    return result;
  }

  /**
   * Considering A as this matrix, Ai as the i-th row and Aij as the
   * element on the j-th column of i-th row. Eliminates Aij from this
   * matrix, where i = [0, y)U(y, m) and j = x.
   * @param x Column to pivot.
   * @param y Row to pivot.
   */
  public pivoting(x: number, y: number): void {
    let aux: Node;

    for (let i = 0; i < this.matrix.length; i++) {
      if (i !== y) {
        aux = this.matrix[i][x].clone();
        for (let j = 0; j < this.matrix[i].length; j++) {
          this.matrix[i][j]
            .subtractHere(this.matrix[y][j].multiply(aux));
        }
      }
    }
  }

  /**
   * Generates a string for representing this matrix.
   * @return The representation of this as a string.
   */
  public toString(): string {
    return this.matrix.map(row => row.join('\t')).join('\n');
  }

  /**
   * Generates an HTML table representative of this matrix.
   * @return This as a HTML table.
   * @throws Error if there is no window with a document.
   */
  public toHTMLElement(): HTMLElement {
    const $table: JQuery = $('<table>');

    for (let i = 0; i < this.matrix.length; i++) {
      const $tr: JQuery = $('<tr>').appendTo($table);
      for (let j = 0; j < this.matrix[i].length; j++) {
        $tr.append($('<td>', {html: this.matrix[i][j] + ''}));
      }
    }

    return $table[0];
  }

  /**
   * Creates a copy of this matrix.
   * @return A clone of this.
   */
  public clone(): Matrix {
    return new Matrix(this.matrix);
  }

  /**
   * Builds this as a MxN Matrix of NaNs.
   * @param m The number of rows.
   * @param n The number of columns.
   */
  private mxnConstructor(m: number, n: number): void {
    this.matrix = [];

    for (let i = 0; i < m; i++) {
      this.matrix.push([]);
      for (let j = 0; j < n; j++) {
        this.matrix[i].push(new Node());
      }
    }
  }

  /**
   * Builds this as a matrix by copying matrix.
   * @param matrix The matrix wanted to be represented as a two
   * dimensional array of numbers, strings or expressions.
   */
  private matrixConstructor(matrix: ValidNumber[][] | Matrix): void {
    if (matrix instanceof Matrix) {
      matrix = matrix.matrix.map(row => row.map(i => i.clone()));
    }

    this.matrix = matrix.map(row => row.map(Node.newNode));
  }
}

/**
 * Calculates recursively the determinant of the given sub matrix until the
 * matrix received is a 2x2 matrix, then it applies returns the determinant:
 * m[0][0]*m[1][1] - m[1][0]*m[0][1].
 * @param m The matrix wanted to get the determinant.
 * @return The determinant of m.
 */
function calcDeterminant(m: Node[][]): Node {
  if (m.length === 2) {
    return m[0][0].multiply(m[1][1]).subtract(m[0][1].multiply(m[1][0]));
  } else if (m.length === 1) {
    return m[0][0].clone();
  }

  const det = new Node(0);
  for (let i = 0; i < m.length; i++) {
    if ((i & 1) === 0) {
      det.addHere(m[0][i].multiply(
        calcDeterminant(subMatrix(m, 0, i))
      ));
    } else {
      det.subtractHere(m[0][i].multiply(
        calcDeterminant(subMatrix(m, 0, i))
      ));
    }
  }
  return det;
}

/**
 * Generates a sub matrix of m without a given row and a given column.
 * @param m The matrix to extract the sub matrix.
 * @param y The row to ignore.
 * @param x The column to ignore.
 * @return A sub matrix without the y-th row and the x-th column.
 */
function subMatrix(m: Node[][], y: number, x: number): Node[][] {
// TODO
  const sm: Node[][] = [];
  for (let i = 0; i < m.length; i++) {
    if (i !== y) {
      sm.push(m[i].slice(0, x).concat(m[i].slice(x + 1, m.length)));
    }
  }

  return sm;
}
