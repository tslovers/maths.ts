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
 *
 * This module example describes an implementation of an Ant Colony
 * Optimization for the Traveling Salesman Problem using the tools provided
 * by maths.ts.
 *
 * Note: The main point of this example is to illustrate the behaviour of
 * the algorithm so it doesn't make use of many functions on maths.ts.
 */

import * as fs from 'fs';
import {AntColony} from './ant';

const filename = process.env.FILE || './assets/1.tsp';

fs.readFile(filename, 'utf8', (err, data: string) => {
    const towns = data.split(/\r?\n/).map( p => {
        const xy = p.split(' ');
        return {
            x: Number(xy[1]),
            y: Number(xy[2])
        };
    });

    const colony = new AntColony(towns);
});
