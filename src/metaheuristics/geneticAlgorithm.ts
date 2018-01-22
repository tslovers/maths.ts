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

import {upperBound} from 'std.ts';

import {NPProblem} from './index';
import {randInt} from '../discrete/integers';

/**
 * Note: Default selection method is always a roulette.
 * @param {NPProblem<T>} problem
 * @param {number} populationSize
 * @param {number} nGenerations
 * @param {number} mutationRate
 * @param {number} mConsiderationRate
 * @param {number} crossoverRate
 * @param {number} selectionRate
 * @returns {T}
 */
export function geneticAlgorithm<T>(problem: NPProblem<T>,
                                    populationSize: number = 30,
                                    nGenerations: number = 500,
                                    mutationRate: number = 0.3,
                                    mConsiderationRate: number = 0.1,
                                    crossoverRate: number = 0.7,
                                    selectionRate: number = 0.5) {
  const nCandidates = Math.floor(populationSize * selectionRate);
  let population: T[] = [];
  let fitnesses = 0;
// Initializing population
  for (let i = 0; i < populationSize; i++) {
    population.push(problem.generateSolution());
    fitnesses += problem.solutionValue(population[i]);
  }

  for (let gen = 0; gen < nGenerations; gen++) {
    const selections: T[] = getCandidates().map(idx => population[idx]);
    const newPopulation: T[] = [];
    fitnesses = 0;

    while (newPopulation.length < populationSize) {
      const a = randInt(0, selections.length);
      let b;
      while ((b = randInt(0, selections.length)) === a) {
      }
      if (Math.random() < crossoverRate) {
// Generating children
        const children = problem.crossover(
          selections[a],
          selections[b]
        );
// Checking probability of mutation
        if (Math.random() < mutationRate) {
          children[0] = problem.generateNeighbors(
            children[0],
            mConsiderationRate,
            1
          )[0];
        }
        if (Math.random() < mutationRate) {
          children[1] = problem.generateNeighbors(
            children[1],
            mConsiderationRate,
            1
          )[0];
        }
        fitnesses += problem.solutionValue(children[0]);
        fitnesses += problem.solutionValue(children[1]);
        newPopulation.push(children[0]);
        newPopulation.push(children[1]);
      }
    }

    const prevBest = population[findBest()];
    population = newPopulation;
    const worstIdx = findWorst();
// Adding previous best solution if its better than the current worst
    if (problem.solutionValue(prevBest) >
      problem.solutionValue(population[worstIdx])) {
// Updating fitnesses
      fitnesses -= problem.solutionValue(population[worstIdx]);
      fitnesses += problem.solutionValue(prevBest);
      population[worstIdx] = prevBest;
    }
  }

  return population[findBest()];

  /**
   * Selects the candidates to crossover to generate the next generation.
   * @returns The index of the candidates to be the parents for the next gen.
   */
  function getCandidates(): number[] {
    const candidates = [];
    const roulette = getRoulette();

    while (candidates.length < nCandidates) {
      const c = upperBound(roulette,
        0,
        roulette.length,
        Math.random());
      if (candidates.indexOf(c) === -1) {
        candidates.push(c);
      }
    }

    return candidates;
  }

  /**
   * Finds the best note in the harmonic memory.
   * @returns The index of the best solution at memory.
   */
  function findBest(): number {
    let k = -1;
    let kValue = -Infinity;

    for (let i = 0; i < population.length; i++) {
      const iValue = problem.solutionValue(population[i]);
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

    for (let i = 0; i < population.length; i++) {
      const iValue = problem.solutionValue(population[i]);
      if (kValue > iValue) {
        k = i;
        kValue = iValue;
      }
    }

    return k;
  }

  /**
   * Generates a roulette for selecting population members according to
   * its fitness.
   * @returns The roulette with the probabilities.
   */
  function getRoulette(): number[] {
    let accumulate = 0;
    const roulette = [];

    for (let i = 0; i < population.length; i++) {
      accumulate += problem.solutionValue(population[i]) / fitnesses;
      roulette.push(accumulate);
    }
    roulette[roulette.length - 1] = 1;

    return roulette;
  }
}
