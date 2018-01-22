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

import {randInt} from '../discrete/integers';
import {NPProblem} from './';

const debug = _debug('mh::sa');

/**
 * Simulated annealing metaheuristic seeks for a global optimal solution for
 * a given problem. This algorithm is inspired by the steel annealing process.
 * @param problem The problem which must have a solution generator, a
 * calculator for the solution and a neighbor generator for each solution.
 * @param nNeighbors The number of neighbors for the solution generated each
 * cycle.
 * @param kDiffer The percentage change of each neighbor from the solution.
 * @param t0 The initial temperature where to start the algorithm. Default 100.
 * @param tf The final temperature where to end the algorithm. Default 0.
 * @param tDecrease Sets the temperature decrease. Default nextT = T - 0.1.
 * @param sRepetitions The maximum number of repetitions for a given
 * solution before temperature drops down.
 * @returns The solution found by this algorithm.
 */
export function simulatedAnnealing<T>(problem: NPProblem<T>,
                                      nNeighbors: number = 1,
                                      kDiffer: number = 2,
                                      t0: number = 100, tf: number = 0,
                                      tDecrease: (t: number) => number = decrease,
                                      sRepetitions: number = 5): T {
// Generates an initial solution
  let solution = problem.generateSolution();
// Calculates the 'energy' of the initial solution
  let sEnergy = problem.solutionValue(solution);
  let k = 0;

  for (let t = t0; t > tf;) {
// Generates nNeighbor candidates solutions from the neighborhood of
// s, then picks one.
    const cSolution = problem
      .generateNeighbors(solution, kDiffer, nNeighbors)[randInt(0, nNeighbors)];
// Calculates 'energy' of candidate solution
    const csEnergy = problem.solutionValue(cSolution);
// Calculates the difference between 'energies'
    const AE = sEnergy - csEnergy;
// Informative, only when debugging
    debug('Temperature = ' + t, 'e^(AE/t) = ' + Math.exp(AE / t));
    debug('curS: ' + solution, 'canS: ' + cSolution);
    debug('curS value: ' + sEnergy, 'canS value: ' + csEnergy);
    if (AE < 0) {
// If candidate solution is a better solution update
      solution = cSolution;
      sEnergy = csEnergy;
      debug('Update, better solution!');
    } else if (Math.random() >= Math.exp(AE / t)) {
// If candidate solution is not a better solution but the
// temperature is high enough then update
      solution = cSolution;
      sEnergy = csEnergy;
      debug('Update, high enough temperature!');
      t = tDecrease(t);
    } else if (k++ === sRepetitions) {
      k = 0;
      t = tDecrease(t);
    }
  }

  return solution;
}

function decrease(t: number): number {
  return t - .1;
}
