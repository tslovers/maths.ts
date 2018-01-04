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
import {World} from './world';
import * as debug from 'debug';

const af = 0.1; // Ant factor
// Original amount of pheromones
const er = 0.8; // Pheromone evaporation rate
// Trail preference
// Greedy preference
// New pheromone deposit preference
// Pure random selection rate
// const problemName = filename.split('/').pop();

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
     * @param antFactor This value multiplied by the number of towns
     * delivers the number of ants to be used.
     * @param evaporationRate The rules of how fast old pheromones evaporate.
     */
    constructor(towns: Coordinate[],
                antFactor: number = af,
                private evaporationRate = er) {
        this.debug('Creating World of Towns');
        this.world = new World(towns, evaporationRate);

        this.debug('Generating ants');
        const ants = Math.ceil(antFactor * towns.length);
        this.ants = [];
        for (let i = 0; i < ants; i++) {
            this.ants.push(new Ant(i, this.world));
        }
        this.debug('Ants were successfully created');
    }

    public optimize() {
        for (let i = 0; i < this.world.towns.length; i++) {
            for (let j = 0; j < this.ants.length; j++) {
                this.ants[j].tourNext();
            }
        }
        this.ants.forEach(console.log);
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
     */
    constructor(private id: number, private world: World) {
        this.debug = debug('Ant ' + id);
        this.distanceTraveled = 0;
        // Update list of towns left
        this.townsVisited = [];
        // Create origin
        this.debug('Selecting starting town');
        this.path = [randInt(0, this.world.towns.length)];
        this.townsVisited[this.town] = true;
    }

    tourNext() {
        const nearest = this.findNearest(5);
    }

    /**
     * Finds the nearest available towns from this ant location.
     * @param limit The max number of neighbors wanted.
     * @returns The nearest towns from this ant location.
     */
    findNearest(limit: number = Infinity): number[] {
        // The current town where the ant is
        const neighbors = [];
        for (let i = 0; i < this.world.towns[this.town].neighbors.length; i++) {
            if (neighbors.length >= limit) {
                break;
            }
            if (!this.townsVisited[this.world.towns[this.town].neighbors[i]]) {
                neighbors.push(this.world.towns[this.town].neighbors[i]);
            }
        }
        return neighbors;
    }

    /**
     * Gets the current town where the ant is.
     * @returns The town where this ant is.
     */
    get town(): number {
        return this.path[this.path.length - 1];
    }
}
