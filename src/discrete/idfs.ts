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

import Graph from '../structures/Graph';
import {Logger} from '../algorithms';
import {graphSearch, VertexElement} from './graphSearch';

const MAX_ITERATION_LIMIT = 100;

let i: number;

/**
 * A implementation of iterative deep first search algorithm.
 * @param graph A Graph object representing the graph to go through.
 * @param source The id of the source vertex.
 * @param destination The id of the destination vertex.
 * @param log Logs information about the algorithm execution.
 * @return true if the vertex is reachable from source graph, false otherwise.
 */
export function idfs(graph: Graph, source: number,
                     destination: number, log?: Logger): boolean {
    let found: boolean;

    for (i = 0; i < MAX_ITERATION_LIMIT && !found; i++) {
        if (log !== undefined)
            log.push({
                name: 'Iterative DFS - Depth: ' + i,
                info: {}
            });
        found = graphSearch(graph, source, destination, pop, push, log);
    }

    return found;
}

/**
 * The extracting function for the list of Vertexes used for dfs.
 * @return The next vertex to evaluate.
 */
function pop(): VertexElement {
    return this.vertexes.pop();
}

/**
 * Pushes an element to the list vertexes.
 * @param e The element to be pushed in vertexes.
 */
function push(e: VertexElement): void {
    if (e.depth < i)
        this.vertexes.push(e);
}