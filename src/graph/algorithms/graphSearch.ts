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

import {Graph} from "../Graph";
import {Vertex} from "../Vertex";
import {Logger} from "../../algorithms/index";

/**
 * An helping Interface for handling the vertex in list. It helps to store information about the vertexes and
 * the path followed to get there as well as the cost and depth for each vertex on list.
 */
export interface VertexElement {
    id: number;
    vertex: Vertex;
    trail: number[];
    cost: number;
    depth: number;
}

/**
 * A generic implementation for transversing graph searching for an element. This algorithm holds a list, defined
 * by the interface VertexList. To be able to execute graphSearch, an outFunction and an inFunction must be provided.
 * This functions will determine the list behavior.
 *
 * BFS, DFS, Uniform cost search and A* are implemented on this function by sending their respective in and out
 * functions for each implementation. e.g. BFS sends Array.shift as next function and DFS send Array.pop instead.
 * @param graph The graph to be transversed.
 * @param source The starting vertex.
 * @param destination The goal vertex.
 * @param outFunction The out function.
 * @param inFunction The in function.
 * @param logger An optional logger to knowing more about the algorithm.
 * @return {boolean} True if destination is reachable from source, false if it does not.
 */
export function graphSearch(graph: Graph, source: number, destination: number, outFunction: () => VertexElement,
                            inFunction: (i: VertexElement) => any, logger?: Logger): boolean {
    // Initializing list with the source element
    let list: VertexList = {
        vertexes: [{
            vertex: graph.vertexes[source],
            id: graph.vertexes[source].id,
            trail: [graph.vertexes[source].id],
            cost: 0,
            depth: 0
        }],
        status: graph.vertexes.map(() => VertexStatus.NOT_VISITED),
        push: inFunction,
        next: outFunction
    };

    if (logger)
        return lgs(list, destination, logger); // Document every step in logger, hence documents the solution path.
    else
        return gs(list, destination);
}

/**
 * Represents the list of vertexes. Moreover, it has functions to push and get next vertex from this (push & next).
 * Push & next are implemented by their respective algorithms; e.g. bfs sends Array.shift as next function.
 */
interface VertexList {
    vertexes: VertexElement[];
    status: VertexStatus[];
    push: (n: VertexElement) => any;
    next: () => VertexElement;
}

/**
 * Represents the status of each vertex. It is handled internally by VertexElement and graphSearch.
 */
enum VertexStatus {
    NOT_VISITED,
    IN_QUEUE,
    VISITED
}

/**
 * Transverses the graph looking for destination.
 * @param list A initial list of vertexes to look for.
 * @param destination The goal of gs.
 * @return {boolean} True if destination is reachable from an element on list, else returns false.
 */
function gs(list: VertexList, destination: number): boolean {
    // Until there is no more elements on list.
    while (list.vertexes.length) {
        let v = list.next();
        list.status[v.id] = VertexStatus.VISITED; // Update status for this node
        // Wuu! Found!
        if (v.id === destination)
            return true;

        v.vertex.edges.forEach(e => { // Add all vertex on neighborhood if required
            if (list.status[e.destination.id] === VertexStatus.NOT_VISITED) {
                list.status[e.destination.id] = VertexStatus.IN_QUEUE; // Update status

                list.push({
                    vertex: e.destination,
                    id: e.destination.id,
                    trail: null,
                    cost: null,
                    depth: null
                });
            }
        });
    }

    return false;
}

/**
 * Transverses the graph looking for destination, besides, it informs about every step and the final path
 * to get to destination (if there is a solution).
 * @param list A initial list of vertexes to look for.
 * @param destination The goal of gs.
 * @param logger A logger about every step on the execution.
 * @return {boolean} Whether destination is reachable from an element on list.
 */
function lgs(list: VertexList, destination: number, logger: Logger): boolean {
    logger.push({
        stepName: 'Starting search of ' + destination + ' from ' + list.vertexes[0].vertex.id,
        stepInfo: {idVertexList: getInfo(list)}
    });
    // Until there is no more elements on list.
    while (list.vertexes.length) {
        let v = list.next();
        list.status[v.id] = VertexStatus.VISITED; // Update status for this node
        logger.push({
            stepName: 'Current node: ' + v.id + (v.id === destination ? ' -> its goal!' : ''),
            stepInfo: {
                addedVertexes: [],
                ignoredVertexes: []
            }
        });

        // Wuu! Found!
        if (v.id === destination) {
            logger[logger.length - 1].stepInfo.idVertexList = getInfo(list);
            logger.push({
                stepName: 'Solution',
                stepInfo: {
                    trail: v.trail,
                    cost: v.cost,
                    depth: v.depth
                }
            });
            return true;
        }

        v.vertex.edges.forEach(e => {
            // Add all vertex on neighborhood if they have not been visited
            if (list.status[e.destination.id] !== VertexStatus.VISITED) {
                list.status[e.destination.id] = VertexStatus.IN_QUEUE; // Update status
                logger[logger.length - 1].stepInfo.addedVertexes.push(e.destination.id);

                let trail = v.trail.map(i => i); // Copy trail
                trail.push(e.destination.id); // Add this as new element on trail

                list.push({
                    vertex: e.destination,
                    id: e.destination.id,
                    trail: trail,
                    cost: v.cost + e.weight,
                    depth: v.depth + 1
                });
            } else
                logger[logger.length - 1].stepInfo.ignoredVertexes.push(e.destination.id);
        });

        logger[logger.length - 1].stepInfo.idVertexList = getInfo(list);
    }

    return false;
}

/**
 * Returns an object representing the current state of the list.
 * @param list The list to be logged.
 * @return Information about the current state of the list.
 */
function getInfo(list: VertexList): any {
    return list.vertexes.map(i => {
        return {
            id: i.id,
            trail: i.trail.map(i => i), // Copying it
            cost: i.cost,
            depth: i.depth
        }
    });
}