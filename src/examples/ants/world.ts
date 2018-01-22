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
import {PriorityQueue} from 'std.ts';
import * as debug from 'debug';

export const K = 100; // This will be a factor to multiply distance

/**
 * Edges are symmetrical, that is AB == BA. They have pheromones, a distance
 * saved in order to avoid constant recalculation.
 */
export interface Edge {
  pheromones: number;
  distance: number;
}

/**
 * Towns are defined by a location expressed as a coordinate, an array of
 * neighbors (which are every town in the world) ordered from the closest
 * neighbor to the furthest and a list of edges that connect to every other
 * town.
 */
export interface Town {
  location: Coordinate;
  neighbors: number[]; // Neighbors sorted from proximity to the town
  edges: Edge[]; // The edge from this to other towns
}

export class World {
  private debug = debug('World');

  /**
   * Initializes this world with towns and edges from one town to another.
   * @param townsCoordinates The list of towns on this world.
   */
  constructor(townsCoordinates: Coordinate[]) {
// Creates the arrays of towns and edges
    this.debug('Mapping towns');
    this._towns = townsCoordinates.map(t => {
      return {
        location: t,
        neighbors: [],
        edges: []
      };
    });
// Updates information about neighbors and edges
    this.debug('Sorting neighbors for each town');
    for (let i = 0; i < this.towns.length; i++) {
      const nQueue = new PriorityQueue<number>(genCmp(i).bind(this));
      for (let j = 0; j < this.towns.length; j++) {
        if (i > j) {
          this.towns[i].edges[j] = this.towns[j].edges[i];
        } else if (i <= j) {
          const d = this.getDistance(i, j);
          this.towns[i].edges[j] = {
            pheromones: K / d,
            distance: d
          };
        }

        nQueue.push(j);
      }
// Fill neighbors starting from nearest
      while (!nQueue.empty()) {
        this.towns[i].neighbors.push(nQueue.pop());
      }
    }

    /**
     * Generates a function to compare and sort according to distances
     * from the received towns to the other town.
     * @param town
     * @returns A function made to compare two towns according to the
     * distance from another specified town.
     */
    function genCmp(town: number) {
// As function to be able to use bind method
      return function (a: number, b: number) {
        const aDistance = this.getDistance(town, a);
        const bDistance = this.getDistance(town, b);

        if (aDistance > bDistance) {
          return -1;
        } else if (aDistance < bDistance) {
          return 1;
        } else {
          return 0;
        }
      };
    }
  }

  private _towns: Town[];

  /**
   * Returns the list of towns in this world with his (x, y) locations.
   * @returns The towns in this world.
   */
  get towns(): Town[] {
    return this._towns;
  }

  /**
   * Updates the quantity of pheromones per path by multiplying the current
   * amount of pheromones times evaporationRate.
   * @param evaporationRate Determines how fast the pheromones will evaporate.
   */
  evaporate(evaporationRate: number) {
    for (let i = 0; i < this.towns.length; i++) {
// Updating half edges because edges are symmetrical
      for (let j = i; j < this.towns[i].edges.length; j++) {
        this.towns[i].edges[j].pheromones *= evaporationRate;
      }
    }
  }

  /**
   * Resets the initial amount of pheromones on each edge between towns.
   */
  reset(): void {
    for (let i = 0; i < this.towns.length; i++) {
      for (let j = i + 1; j < this.towns.length; j++) {
        this.towns[i].edges[j].pheromones =
          K / this.towns[i].edges[j].distance;
      }
    }
  }

  /**
   * Returns the requested path.
   * @param a The origin.
   * @param b The destination.
   * @returns Information about the path from a to b.
   */
  getEdge(a: number, b: number): Edge {
    return this.towns[a].edges[b];
  }

  /**
   * Calculates the euclidean distance between point a and point b; a & b
   * must be numbers within the limits of the towns array.
   * @param a The first town.
   * @param b The second town.
   * @returns The distance between a town and b town.
   */
  getDistance(a: number, b: number): number {
    return euclideanDistance(
      this.towns[a].location,
      this.towns[b].location
    );
  }
}

/**
 * Calculates euclidean distance between two points.
 * @param a The first point.
 * @param b The second point.
 * @returns The distance between a & b.
 */
function euclideanDistance(a: Coordinate, b: Coordinate) {
  return ((a.x - b.x) ** 2 + (a.y - b.y) ** 2) ** (1 / 2);
}
