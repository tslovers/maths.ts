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

import {NPProblem} from '../../metaheuristics/index';
import {randInt} from '../../discrete/integers';
import {InputError} from '../../core/Error';
import * as discrete from '../../discrete';
import {BitSet} from 'std.ts';

/**
 * Generates a Linear Ordering Problem with a given matrix of weights ready to
 * solve with the metaheuristics described in this library.
 * @param wij The matrix of weights for the linear ordering problem.
 */
export function generateLOP(wij: number[][]): NPProblem<number[]> {
  for (let i = 0; i < wij.length; i++) {
    if (wij.length !== wij[i].length) {
      throw new InputError('The received matrix is not a square matrix');
    }
  }

  const nodes = wij.length;

  return {
    solutionValue: solutionValue,
    generateSolution: generateSolution,
    generateNeighbors: generateNeighbors,
    compareSolutions: compareSolutions,
    crossover: crossover
  };

  /**
   * Checks if two solutions are equals.
   * @param a One solution to compare.
   * @param b The other solution to compare.
   */
  function compareSolutions(a: number[], b: number[]): boolean {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Calculates the value of a given solution adding the weights of the
   * matrix received by this closure.
   * @param s The solution to get the value.
   * @returns The value of this solution.
   */
  function solutionValue(s: number[]): number {
    let value = 0;

    for (let i = 0; i < s.length; i++) {
      for (let j = i + 1; j < s.length; j++) {
        value += wij[s[i]][s[j]];
      }
    }

    return value;
  }

  /**
   * Generates a random solution for Linear Ordering Problem.
   * @returns A permutation representing the solution for the LOP.
   */
  function generateSolution(): number[] {
    return discrete.randPermutation(nodes);
  }

  /**
   * Generates a number of random neighbor given for the corresponding
   * solution.
   * @param curSolution The solution from which is necessary to get some
   * neighbors.
   * @param nNeighbors The number of neighbors wanted to be generated.
   * @param kDiffer The number or proportion in which the solution will
   * change.
   * @returns An array of neighbors of cuSolution.
   */
  function generateNeighbors(curSolution: number[],
                             kDiffer: number = 2,
                             nNeighbors: number = 1): number[][] {
    const permutations: number[][] = [];

    if (kDiffer > 0 && kDiffer < 1) {
// If its a proportion calculate the number of times to change this.
      kDiffer = Math.ceil(curSolution.length * kDiffer);
    } else if (kDiffer >= 1) {
// If its an integer calculates the ceil in case the user send a float.
      kDiffer = Math.ceil(kDiffer);
    } else {
// If the user is stupid just go with 2
      kDiffer = 2;
    }

    while (permutations.length < nNeighbors) {
      const perm = curSolution.slice();
      for (let k = 0; k < kDiffer; k++) {
        let i = 0, j = 0;
        while (i === j && curSolution.length !== 1) {
          i = randInt(0, curSolution.length);
          j = randInt(0, curSolution.length);
        }
        const p = perm[i];
        perm[i] = perm[j];
        perm[j] = p;
      }
      permutations.push(perm);
    }

    return permutations;
  }

  function crossover(a: number[],
                     b: number[],
                     variation: number = .5): number[][] {
    const children: number[][] = [];
// Initializing mask
    const mask = new BitSet(a.length);
    const vNumber = Math.ceil(variation * a.length);
    const aBased: number[] = [],
      bBased: number[] = [],
      acBased: number[] = [],
      bcBased: number[] = [];

    for (let i = 0; i < vNumber; i++) {
      while (mask.numOn <= i) {
        const n = randInt(0, a.length);
        if (!mask.get(n)) {
          aBased[n] = a[n];
          bBased[n] = b[n];
          mask.set(n, true);
        }
      }
    }

    let j = -1;
// Finds first empty space
    while (aBased[++j] !== undefined) {}
    let k = j;

    let str = '[ ';
    for (let i = 0; i < mask.size; i++) {
      if (i !== 0) {
        str += ', ';
      }
      str += mask.get(i) ? '1' : '0';
    }
    str += ' ]';
    for (let i = 0; i < a.length; i++) {
      if (aBased.indexOf(b[i]) === -1) {
        aBased[j] = b[i];
        while (aBased[++j] !== undefined) {}
      }
      if (bBased.indexOf(a[i]) === -1) {
        bBased[k] = a[i];
        while (bBased[++k] !== undefined) {}
      }
    }

    children.push(aBased);
    children.push(bBased);

    return children;
  }
}
