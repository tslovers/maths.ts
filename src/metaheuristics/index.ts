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

export * from './simulatedAnnealing';
export * from './harmonySearch';
export * from './tabooSearch';

/**
 * Metaheuristics are meant to solve NP Problems, this NPProblem interface
 * tries to define a generic use of NPProblems, where T is the type of
 * solution the algorithm will use.
 */
export interface NPProblem<T> {
  solutionValue: (s: T) => number;
  generateSolution: () => any;
  compareSolutions: (a: T, b: T) => boolean;
  generateNeighbors: (s: T, kDiffer?: number, nNeighbors?: number) => T[];
  crossover: (a: T, b: T, variation?: number) => T[];
  description?: any;
}
