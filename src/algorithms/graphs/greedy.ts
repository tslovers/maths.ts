import {Graph} from '../../structures/graph';
import {Logger} from '../index';
import {graphSearch, VertexElement} from "./graphSearch";

/**
 * A implementation of uniform cost search algorithm.
 * @param graph A Graph object representing the graphs to go through.
 * @param source The starting vertex.
 * @param destination The desired vertex.
 * @param log Logs information about bfs execution.
 * @return {boolean} Whether the vertex is reachable from source graphs or not.
 */
export function greedySearch(graph: Graph, source: number, destination: number, log?: Logger): boolean {
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
            if (graph.heuristicValue(this.vertexes[i].id, destination) > graph.heuristicValue(e.id, destination))
                break;
        this.vertexes.splice(i, 0, e);
    }
}

/**
 * The extracting function for the list of Vertexes used for ucs.
 * @return {VertexElement} The next vertex to evaluate.
 */
function shift(): VertexElement {
    return this.vertexes.shift();
}