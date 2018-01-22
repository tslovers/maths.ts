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
import Vertex from '../structures/Vertex';
import {Logger} from '../algorithms';

export interface GraphSearchSolution {
  trail?: string[];
  cost?: number;
  depth?: number;
  reachable: boolean;
}

/**
 * An helping Interface for handling the vertex in list. It helps to store
 * information about the vertexes and the path followed to get there as well
 * as the cost and depth for each vertex on list.
 */
export interface VertexElement {
  id: number;
  vertex: Vertex;
  trail: number[];
  cost: number;
  depth: number;
}

/**
 * A generic implementation for transversing graph searching for an element.
 * This algorithm holds a list, defined by the interface VertexList. To be
 * able to execute graphSearch, an outFunction and an inFunction must be
 * provided. This functions will determine the list behavior.
 *
 * BFS, DFS, Uniform cost search and A* are implemented on this function by
 * sending their respective in and out functions for each implementation.
 * e.g. BFS sends Array.shift as next function and DFS send Array.pop instead.
 * @param graph The graph to be transversed.
 * @param source The starting vertex.
 * @param destination The goal vertex.
 * @param outFunction The out function.
 * @param inFunction The in function.
 * @param logger An optional logger to knowing more about the algorithm.
 * @return A GraphSearchSolution interface with its reachable element false
 * if the destination element was not found in the graph. The reachable
 * element will be true if the element was in the graph alongside with more
 * information about cost, depth and trail to get to the solution.
 */
export function graphSearch(graph: Graph, source: number, destination: number,
                            outFunction: () => VertexElement,
                            inFunction: (i: VertexElement) => any,
                            logger?: Logger): GraphSearchSolution {
// Initializing list with the source element
  const list: VertexList = {
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

  return gs(list, destination, logger);
}

/**
 * Represents the list of vertexes. Moreover, it has functions to push and
 * get next vertex from this (push & next). Push & next are implemented by
 * their respective algorithms; e.g. bfs sends Array.shift as next function.
 */
interface VertexList {
  vertexes: VertexElement[];
  status: VertexStatus[];
  push: (n: VertexElement) => any;
  next: () => VertexElement;
}

/**
 * Represents the status of each vertex. It is handled internally by
 * VertexElement and graphSearch.
 */
enum VertexStatus {
  NOT_VISITED,
  IN_QUEUE,
  VISITED
}

/**
 * Transverses the graph looking for destination, besides, it informs about
 * every name and the final path to get to destination (if there is a solution).
 * @param list A initial list of vertexes to look for.
 * @param destination The goal of gs.
 * @param logger A logger about every name on the execution.
 * @return A GraphSearchSolution interface with its reachable element false
 * if the destination element was not found in the graph. The reachable
 * element will be true if the element was in the graph alongside with more
 * information about cost, depth and trail to get to the solution.
 */
function gs(list: VertexList, destination: number,
            logger: Logger): GraphSearchSolution {
  if (logger) {
    logger.push({
      name: 'Starting search of ' + destination + ' from ' +
      list.vertexes[0].vertex.id,
      info: {idVertexList: getInfo(list)}
    });
  }

// Until there is no more elements on list.
  while (list.vertexes.length) {
    const v = list.next();
    list.status[v.id] = VertexStatus.VISITED; // Update status for this node
    if (logger) {
      logger.push({
        name: 'Current node: ' + v.id + (v.id === destination ?
          ' -> its goal!' : ''),
        info: {
          addedVertexes: [],
          ignoredVertexes: []
        }
      });
    }

// Wuu! Found!
    if (v.id === destination) {
      if (logger) {
        logger[logger.length - 1].info.idVertexList = getInfo(list);
        logger.push({
          name: 'GraphSearchSolution',
          info: {
            trail: v.trail,
            cost: v.cost,
            depth: v.depth
          }
        });
      }
      return {
        trail: v.trail.map(i => i + ''),
        cost: v.cost,
        depth: v.depth,
        reachable: true
      };
    }

    v.vertex.edges.forEach(e => {
// Add all vertex on neighborhood if they have not been visited
      if (list.status[e.destination.id] !== VertexStatus.VISITED) {
// Update status
        list.status[e.destination.id] = VertexStatus.IN_QUEUE;
        if (logger) {
          logger[logger.length - 1].info
            .addedVertexes.push(e.destination.id);
        }

// Copy trail
        const trail = v.trail.slice();
// Add this as new element on trail
        trail.push(e.destination.id);

        list.push({
          vertex: e.destination,
          id: e.destination.id,
          trail: trail,
          cost: v.cost + e.weight,
          depth: v.depth + 1
        });
      } else if (logger) {
        logger[logger.length - 1].info
          .ignoredVertexes.push(e.destination.id);
      }
    });

    if (logger) {
      logger[logger.length - 1].info.idVertexList = getInfo(list);
    }
  }

  return {
    reachable: false
  };
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
      trail: i.trail.map(e => e), // Copying it
      cost: i.cost,
      depth: i.depth
    };
  });
}
