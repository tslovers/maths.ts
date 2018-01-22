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

import * as _debug from 'debug';

import {NPProblem} from './';

const debug = _debug('mh::ts');

/**
 *
 * @param problem The problem which must have a solution generator, a
 * calculator for the solution and a neighbor generator for each solution.
 * @param nNeighbors The number of neighbors for the solution generated each
 * cycle.
 * @param kDiffer The percentage change of each neighbor from the solution.
 * @param tlSize The taboo list size.
 * @param iterations The number of iterations executing the algorithm.
 * @returns The solution found by this algorithm.
 */
export function tabooSearch<T>(problem: NPProblem<T>,
                               nNeighbors: number = 5,
                               kDiffer: number = 2,
                               tlSize: number = 30,
                               iterations: number = 100): T {
// Generates an initial solution
  const sol = problem.generateSolution();
  const tabooList: T[] = [];
  let bestS = sol;
  debug('Initial sol: ' + bestS);
  let bestVal = problem.solutionValue(bestS);
  for (let i = 0; i < iterations; i++) {
    const neighbors = problem.generateNeighbors(sol, kDiffer, nNeighbors);
    const candidates: T[] = [];
    neighbors.forEach(n => {
      debug('%s=%d', '' + n, problem.solutionValue(n));
      if (!isIn(n, tabooList)) {
        candidates.push(n);
      }
    });
    let bestC: T = candidates[0];
    let bestCVal = 0;
    candidates.forEach(c => {
      const cVal = problem.solutionValue(c);
      if (cVal > bestCVal) {
        bestCVal = cVal;
        bestC = c;
      }
    });
    debug('Picked: %s=%d', '' + bestC, bestCVal);
    if (bestCVal > bestVal) {
      debug('Solution updated to ' + bestC);
      bestS = bestC;
      bestVal = bestCVal;
      tabooList.unshift(bestC);
      if (tabooList.length >= tlSize) {
        tabooList.pop();
      }
    }
  }
  debug(tabooList);

  return bestS;

  function isIn(e: T, array: T[]): boolean {
    for (let i = 0; i < array.length; i++) {
      if (problem.compareSolutions(array[i], e)) {
        return true;
      }
    }
    return false;
  }
}
