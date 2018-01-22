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

import Edge from './Edge';
import Vertex from './Vertex';

export type weightFunc = (s: Vertex, d: Vertex) => number;

/**
 * Represents a graph as an adjacency list. It provides methods for
 * adding/removing vertex and edges.
 */
export default class Graph {
  private _heuristic: (s: Vertex, d: Vertex) => number;

  /**
   * Builds a graph with or without vertex.
   * TODO: neighbor and graph function generators.
   * @param nVertexes The initial number of vertexes for this.
   * @param directed Indicates if the graph is going to be a directed
   * graph or not.
   */
  constructor(nVertexes?: number, private directed: boolean = false) {
// TODO: There may be a better way to built a graph, I think.
    this._vertexes = [];
    this.directed = directed;
    for (let i = 0; i < nVertexes; i++) {
      this.addVertex();
    }
  }

  private _vertexes: Vertex[];

  /**
   * Gets the vertex in this graph.
   * @return The vertexes of this graph.
   */
  get vertexes(): Vertex[] {
    return this._vertexes;
  }

  /**
   * Gets all edges from Graph.
   * @return The edges of this graph.
   */
  get edges(): Edge[] {
    const es: Edge[] = [];
    this.vertexes.forEach(
      (v) => v.edges.forEach((e) => es.push(e))
    );
    return es;
  }

  /**
   * Adds a vertex to this graph.
   * @param name The name for the new vertex.
   * @param info Additional name about the vertex.
   */
  public addVertex(name?: string, info?: any): void {
    this.vertexes.push(new Vertex(this.vertexes.length, name, info));
  }

  /**
   * Builds an edge, then adds it to the source vertex.
   * @param from
   * @param to
   * @param weight
   * @param info
   */
  public addEdge(from: number, to: number, weight?: number | weightFunc,
                 info?: any) {
    this.vertexes[from].addEdge(
      new Edge(this.vertexes[from], this.vertexes[to], weight, info)
    );
    if (!this.directed) {
      this.vertexes[to].addEdge(
        new Edge(this.vertexes[to], this.vertexes[from], weight, info)
      );
    }
  }

  /**
   * Returns the value gotten from evaluating a given heuristic with given
   * source and destination.
   * @param s The source.
   * @param d The destination.
   * @return {number} The distance between them according to the heuristic
   * defined on this graph.
   */
  public heuristicValue(s: number, d: number): number {
    if (this._heuristic) {
      return this._heuristic(this.vertexes[s], this.vertexes[d]);
    }
    return 0;
  }

  /**
   * Sets a heuristic for this graph.
   * @param h The new heuristic.
   */
  public setHeuristic(h: (s: Vertex, d: Vertex) => number): void {
    this._heuristic = h;
  }

  /**
   * Prints this graph vertex and adjacency list.
   */
  public toString(): string {
    if (this._vertexes.length <= 0) {
      return 'Empty graph';
    }
    return 'Graph:\n\t' + this.vertexes.join('\n\t');
  }
}
