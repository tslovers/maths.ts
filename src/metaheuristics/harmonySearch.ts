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
import {randInt} from '../discrete/integers';

const debug = _debug('mh::hs');

/**
 *
 * @param problem The problem which must have a solution generator, a
 * calculator for the solution and a neighbor generator for each solution.
 * @param hms Harmonic memory size.
 * @param hmcr Harmonic memory consideration rate represents the probability
 * to use the harmonic memory to generate a solution.
 * @param kDiffer Percentage of change of each neighbor from the solution.
 * @param maxIt
 * @returns The solution found by this algorithm.
 */
export function harmonicSearch<T>(problem: NPProblem<T>,
                                  hms: number = 30,
                                  hmcr: number = 0.7,
                                  kDiffer: number = 2,
                                  maxIt: number = 500): T {
// Generates an initial harmonic memory
  const hMemory: T[] = [];
  for (let i = 0; i < hms; i++) {
    hMemory.push(problem.generateSolution());
  }

  for (let i = 0; i < maxIt; i++) {
    let is;
    if (hmcr > Math.random()) {
      is = problem.generateNeighbors(
        hMemory[randInt(0, hMemory.length)],
        kDiffer, // Variation respecting the selected one
      )[0];
    } else {
      is = problem.generateSolution();
    }

    const w = findWorst();
    if (problem.solutionValue(is) >= problem.solutionValue(hMemory[w])) {
      hMemory[w] = is;
    }
  }

  return hMemory[findBest()];

  /**
   * Finds the best note in the harmonic memory.
   * @returns The index of the best solution at memory.
   */
  function findBest(): number {
    let k = -1;
    let kValue = -Infinity;

    for (let i = 0; i < hMemory.length; i++) {
      const iValue = problem.solutionValue(hMemory[i]);
      if (kValue < iValue) {
        k = i;
        kValue = iValue;
      }
    }

    return k;
  }

  /**
   * Finds the worst note in the harmonic memory.
   * @returns The index of the worst solution at memory.
   */
  function findWorst(): number {
    let k = -1;
    let kValue = Infinity;

    for (let i = 0; i < hMemory.length; i++) {
      const iValue = problem.solutionValue(hMemory[i]);
      if (kValue > iValue) {
        k = i;
        kValue = iValue;
      }
    }

    return k;
  }
}
