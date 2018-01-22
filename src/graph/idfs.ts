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
import {graphSearch, GraphSearchSolution, VertexElement} from './graphSearch';

const MAX_ITERATION_LIMIT = 100;

let i: number;

/**
 * A implementation of iterative deep first search algorithm.
 * @param graph A Graph object representing the graph to go through.
 * @param source The id of the source vertex.
 * @param destination The id of the destination vertex.
 * @param log Logs information about the algorithm execution.
 * @return A GraphSearchSolution interface with its reachable element false
 * if the destination element was not found in the graph. The reachable
 * element will be true if the element was in the graph alongside with more
 * information about cost, depth and trail to get to the solution.
 */
export function idfs(graph: Graph, source: number,
                     destination: number, log?: Logger): GraphSearchSolution {
  let solution: GraphSearchSolution = {reachable: false};

  for (i = 0; i < MAX_ITERATION_LIMIT && !solution.reachable; i++) {
    if (log !== undefined) {
      log.push({
        name: 'Iterative DFS - Depth: ' + i,
        info: {}
      });
    }
    solution = graphSearch(graph, source, destination, pop, push, log);
  }

  return solution;
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
  if (e.depth < i) {
    this.vertexes.push(e);
  }
}
