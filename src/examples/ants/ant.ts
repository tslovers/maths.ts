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

import {Coordinate} from '../../plotter/index';
import {randInt} from '../../discrete/integers';
import {K, Town, World} from './world';
import * as debug from 'debug';
import {upperBound} from 'std.ts';

// Default values
const af = 0.1; // Ant factor
const er = 0.9; // Pheromone evaporation rate
const BETA = 1.9; // Trail preference
const ALPHA = 1.7; // Greedy preference

export interface Solution {
  distance: number;
  path: number[];
}

/**
 * Contains collective information retrieved by the ants of this colony.
 * Furthermore, it determines when to move ants and how they must behave.
 */
export class AntColony {
  private debug = debug('Colony');
  private ants: Ant[];
  private world: World;

  /**
   * Creates a new colony of ants (antFactor*towns.length ants).
   * @param towns An array holding the coordinates of each town.
   */
  constructor(towns: Coordinate[]) {
    this.debug('Creating World of Towns');
    this.world = new World(towns);
  }

  /**
   * Performs the Ant Colony Optimization by putting each ant to find a
   * solution.
   * @param iterations The number of times to reach a new solution per ant.
   * @param antFactor This value multiplied by the number of towns
   * delivers the number of ants to be used.
   * @param evaporationRate The rules of how fast old pheromones evaporate.
   * @param alpha The pheromone preference.
   * @param beta The greedy preference.
   */
  async optimize(iterations: number = 5,
                 antFactor = af,
                 evaporationRate = er,
                 alpha = ALPHA,
                 beta = BETA): Promise<Solution> {
    this.debug('Generating ants');
// Generating ants
    const ants = Math.ceil(antFactor * this.world.towns.length);
    this.ants = [];
    for (let i = 0; i < ants; i++) {
      this.ants.push(new Ant(i, this.world, alpha, beta));
    }
    this.debug('Putting initial pheromones');
    this.world.reset();
// Performing optimization
    let best: Solution = {
      path: undefined,
      distance: Infinity
    };

    const promises: Promise<Solution>[] = [];
    for (let k = 0; k < iterations; k++) {
      for (let j = 0; j < this.ants.length; j++) {
        promises[j] = this.ants[j].tour();
      }

      await Promise.all(promises).then(solutions => {
// Finds best solution
        solutions.forEach(s => {
          if (best.distance > s.distance) {
            best = s;
          }

// Experimental improvement: The idea is that if the
// final distance after this solutions is good, then
// reinforcement of each edge on this path would improve
// even more the solution
/// Reference: ACO Algorithm with Additional Reinforcement
/// https://link.springer.com/chapter/10.1007/3-540-45724-0_31
          const p = K / s.distance;
          for (let i = 0; i < s.path.length; i++) {
            const next = (i + 1) % s.path.length;
            this.world.towns[s.path[i]].edges[s.path[next]].pheromones += p;
          }
        });
      });
      this.world.evaporate(evaporationRate);
    }

    return best;
  }
}

export class Ant {
  private path: number[];
  private distanceTraveled: number;
  private debug: debug.IDebugger;
// A map for checking which cities were visited at low cost
  private townsVisited: boolean[];

  /**
   * Creates a new ant.
   * @param id The id for this ant.
   * @param world The world where this ant is.
   * @param alpha Preference given to ...
   * @param beta Preference given to ...
   */
  constructor(private id: number,
              private world: World,
              private alpha: number,
              private beta: number) {
    this.debug = debug('Ant ' + id);
    this.distanceTraveled = 0;
// Update list of towns left
    this.townsVisited = [];
// Create origin
    this.path = [randInt(0, this.towns.length)];
    this.debug('Starting town selected: ' + this.town);
    this.townsVisited[this.town] = true;
  }

  /**
   * Gets the towns on this ant's world.
   * @returns The towns on this ant's world.
   */
  get towns(): Town[] {
    return this.world.towns;
  }

  /**
   * Gets the current town where the ant is.
   * @returns The town where this ant is.
   */
  get town(): number {
    return this.path[this.path.length - 1];
  }

  /**
   * Returns the current path.
   */
  get curSolution(): Solution {
// Distance from end to start
    const d = this.towns[this.town].edges[this.path[0]].distance;
    return {
      path: this.path.slice(),
// Travel distance + distance from end to start
      distance: this.distanceTraveled + d
    };
  }

  /**
   * Finds a probabilistic route executing next town.
   * @returns {Promise<Solution>}
   */
  async tour(): Promise<Solution> {
    while (this.path.length < this.towns.length) {
      this.tourNext();
    }

    this.debug('Route found. Distance: ' + this.curSolution.distance);
    return this.curSolution;
  }

  /**
   * Visits next town.
   */
  tourNext() {
    const nearest = this.findNearest(15);
// Create roulette
    const pp: number[] = [];
    let sum = 0;
    nearest.forEach(t => {
      const neighbor = this.towns[t];
      const p = neighbor.edges[this.town].pheromones ** this.alpha +
        (K / neighbor.edges[this.town].distance) ** this.beta;
      sum += p;
      pp.push(p);
    });
    for (let i = 0; i < pp.length; i++) {
      pp[i] /= sum;
      if (i) {
        pp[i] += pp[i - 1];
      }
    }
// Last must be 1
    pp[pp.length - 1] = 1;
// Randomly biased select the next town
    let nextTown = upperBound(pp, 0, pp.length, Math.random());
    nextTown = nearest[nextTown];
// this.debug('Next town: ' + nextTown);
    const d = this.towns[this.town].edges[nextTown].distance;
    this.distanceTraveled += d;
    this.towns[this.town].edges[nextTown].pheromones += K / d;
    this.path.push(nextTown);
    this.townsVisited[this.town] = true;
  }

  /**
   * Finds the nearest available towns from this ant location.
   * @param limit The max number of neighbors wanted.
   * @returns The nearest towns from this ant location.
   */
  findNearest(limit: number = Infinity): number[] {
// The current town where the ant is
    const neighbors = [];
    for (let i = 0; i < this.towns[this.town].neighbors.length; i++) {
      if (neighbors.length >= limit) {
        break;
      }
      if (!this.townsVisited[this.towns[this.town].neighbors[i]]) {
        neighbors.push(this.towns[this.town].neighbors[i]);
      }
    }
    return neighbors;
  }
}
