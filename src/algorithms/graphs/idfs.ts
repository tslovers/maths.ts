import {Graph} from '../../structures/graph';
import {Logger} from '../index';
import {graphSearch, VertexElement} from "./graphSearch";

const MAX_ITERATION_LIMIT = 100;

let i: number;

/**
 * A modification of deep first search implementation called iterative deep first search.
 * @param graph A Graph object representing the graphs to go through.
 * @param source The starting vertex.
 * @param destination The desired vertex.
 * @param log Logs information about bfs execution.
 * @return {boolean} Whether the vertex is reachable from source graphs or not.
 */
export function idfs(graph: Graph, source: number, destination: number, log?: Logger): boolean {
    let found: boolean;

    for (i = 0; i < MAX_ITERATION_LIMIT && !found; i++) {
        if (log !== undefined)
            log.push({
                stepName: 'Iterative DFS - Depth: ' + i,
                stepInfo: {}
            });
        found = graphSearch(graph, source, destination, pop, push, log);
    }

    return found;
}

/**
 * The extracting function for the list of Vertexes used for dfs.
 * @return {VertexElement} The next vertex to evaluate.
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