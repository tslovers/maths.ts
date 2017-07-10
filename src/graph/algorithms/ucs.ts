import {Graph} from '../Graph';
import {Logger} from '../../algorithms/index';
import {graphSearch, VertexElement} from "./graphSearch";

/**
 * A implementation of uniform cost search algorithm.
 * @param graph A Graph object representing the graph to go through.
 * @param source The id of the source vertex.
 * @param destination The id of the destination vertex.
 * @param log Logs information about the algorithm execution.
 * @return {boolean} True if the vertex is reachable from source graph or not.
 */
export function ucs(graph: Graph, source: number, destination: number, log?: Logger): boolean {
    if (log === undefined)
        log = [];
    return graphSearch(graph, source, destination, shift, push, log);
}

/**
 * The extracting function for the list of Vertexes used for ucs.
 * @return {VertexElement} The next vertex to evaluate.
 */
function shift(): VertexElement {
    return this.vertexes.shift();
}

/**
 * Pushes an element to the list vertexes.
 * @param e The element to be pushed in vertexes.
 */
function push(e: VertexElement): void {
    let i;
    for (i = 0; i < this.vertexes.length; i++)
        if (this.vertexes[i].cost > e.cost)
            break;
    this.vertexes.splice(i, 0, e);
}