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

import {Graph} from '../Graph';
import {Logger} from '../../algorithms/index';
import {graphSearch, VertexElement} from "./graphSearch";

/**
 * A implementation of A star search algorithm.
 * @param graph A Graph object representing the graph to go through.
 * @param source The id of the source vertex.
 * @param destination The id of the destination vertex.
 * @param log Logs information about the algorithm execution.
 * @return {boolean} True if the vertex is reachable from source graph or not.
 */
export function aStar(graph: Graph, source: number, destination: number, log?: Logger): boolean {
    if (log === undefined)
        log = [];
    return graphSearch(graph, source, destination, shift, push, log);

    /**
     * Pushes an element to the list vertexes.
     * @param e The element to be pushed in vertexes.
     */
    function push(e: VertexElement): void {
        let i;
        for (i = 0; i < this.vertexes.length; i++)
            if (graph.heuristicValue(this.vertexes[i].id, destination) + this.vertexes[i].cost
                > graph.heuristicValue(e.id, destination) + e.cost)
                break;
        this.vertexes.splice(i, 0, e);
    }
}

/**
 * The extracting function for the list of Vertexes used for a star.
 * @return {VertexElement} The next vertex to evaluate.
 */
function shift(): VertexElement {
    return this.vertexes.shift();
}