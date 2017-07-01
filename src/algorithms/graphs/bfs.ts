import {Graph} from '../../structures/graph';
import {Logger} from '../index';
import {graphSearch, VertexElement} from "./graphSearch";

/**
 * The classic breadth first search implementation.
 * @param graph A Graph object representing the graphs to go through.
 * @param source The starting vertex.
 * @param destination The desired vertex.
 * @param log Logs information about bfs execution.
 * @return {boolean} Whether the vertex is reachable from source graphs or not.
 */
export function bfs(graph: Graph, source: number, destination: number, log?: Logger): boolean {
    return graphSearch(graph, source, destination, shift, push, log);
}

/**
 * The extracting function for the list of Vertexes used for bfs.
 * @return {VertexElement} The next vertex to evaluate.
 */
function shift(): VertexElement {
    return this.vertexes.shift();
}

/**
 * Pushes an element to the list vertexes.
 * @param i The element to be pushed in vertexes.
 */
function push(i: VertexElement): void {
    this.vertexes.push(i);
}