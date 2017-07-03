/**
 * @licence
 * Copyright (C) 2017 Hector J. Vasquez <ipi.vasquez@gmail.com>
 *
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

export type weightFunc = (s: Vertex, d: Vertex) => number;

/**
 * Represents an edge of a graphs. It must provides a source, a destination and optionally a _weight and info.
 */
export class Edge {
    private _source: Vertex;
    private _destination: Vertex;
    private _weight: number;
    private weightFunction: weightFunc;
    public info: any;

    /**
     * Builds this with respective source, destination, weight(optional) and info(optional).
     * @param source The source of this.
     * @param destination The destination of this.
     * @param weight The weight for this. It may be the result of a function or just a number.
     * @param info Additional info for this.
     */
    constructor(source: Vertex, destination: Vertex, weight?: number | weightFunc, info?: any) {
        this.source = source;
        // this._source = source; TODO is valid the one up this?
        this._destination = destination;
        if (typeof weight === 'number')
            this._weight = weight;
        else
            this.setWeightFunction(weight);
        this.info = info;
    }

    get source(): Vertex {
        return this._source;
    }

    set source(value: Vertex) {
        this._source = value;
    }

    get destination(): Vertex {
        return this._destination;
    }

    set destination(value: Vertex) {
        this._destination = value;
    }

    get weight(): number {
        if (this.weightFunction)
            return this.weightFunction(this.source, this.destination);
        else if (this._weight === undefined)
            return 1;
        else
            return this._weight;
    }

    set weight(w: number) {
        this._weight = w;
    }

    private setWeightFunction(f: weightFunc) {
        this.weightFunction = f;
    }

    private removeWeightFunction() {
        this.weightFunction = undefined;
    }

    /**
     * Returns this as an coordinate: (source, destiny, weight).
     * @return {string} The representation of this.
     */
    public toString() {
        return '(' + this.source.name + ', ' + this.destination.name +
            (this.weight !== undefined ? ', ' + this.weight : '') + ')';
    }
}

/**
 * Represents a vertex of a graphs. It must provide an id and a neighborhood, that is, a list of adjacent vertexes.
 * Vertexes may be built manually or with the Graph class for its internal handling.
 */
export class Vertex {
    public id: number;
    private _edges: Edge[];
    private _name: string;
    private info: any;

    /**
     * Builds a vertex with an optional name and optional extra information for it.
     * @param id The id of this vertex on graphs.
     * @param name The name this is going to get when printing.
     * @param info
     */
    constructor(id: number, name?: string, info?: any) {
        this.id = id;
        this._name = name;
        this.info = info;
        this._edges = [];
    }

    /**
     * Adds an edge to this vertex neighborhood.
     * @param e The new edge from this.
     */
    public addEdge(e: Edge): void {
        for (let i = 0; i < this._edges.length; i++)
            if (this.edges[i].source.equals(e.source) && this.edges[i].destination === e.destination) {
                if (this.edges[i].weight && e.weight && this.edges[i].weight > e.weight)
                    this.edges[i] = e;
                return;
            }
        this.edges.push(e);
    }

    /**
     * Return the list of edges adjacent to this.
     */
    get edges(): Edge[] {
        return this._edges;
    }

    /**
     * The name for this vertex, if there is.
     * @return {string}
     */
    get name(): string {
        if (this._name)
            return this._name;
        return this.id + '';
    }

    /**
     * Sets a name for this graphs.
     * @param value The new name for this.
     */
    set name(value: string) {
        this._name = value;
    }

    /**
     * Returns the neighborhood of this vertex.
     */
    public getNeighborHood(): Vertex[] {
        return this.edges.map((e) => e.destination);
    }

    /**
     * Checks if another vertex is equivalent to this.
     * @param v The other vertex.
     * @return {boolean} this === v
     */
    public equals(v: Vertex): boolean {
        return v._edges === this._edges && this._name === v._name;
    }

    /**
     * Prints the name of this.
     * @return {string} The name of this.
     */
    public toString(): string {
        return this.name + (this.edges.length ? ': ' : '') + this.edges.join(', ');
    }
}

/**
 * Represents a graphs as an adjacency list. It provides methods for adding/removing vertex and edges.
 */
export class Graph {
    private _vertexes: Vertex[];
    private _heuristic: (s: Vertex, d: Vertex) => number;
    private directed: boolean;

    /**
     * Builds a graphs with or without vertex. // TODO: neighbor and graphs function generators.
     * @param nVertexes The initial number of vertexes for this.
     * @param directed Indicates if the graph is going to be a directed graph or not.
     */
    constructor(nVertexes?: number, directed: boolean = false) {
        // TODO: There may be a better way to built a graphs, I think.
        this._vertexes = [];
        this.directed = directed;
        for (let i = 0; i < nVertexes; i++)
            this.addVertex();
    }

    /**
     * Adds a vertex to this graphs.
     * @param name The name for the new vertex.
     * @param info Additional info about the vertex.
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
    public addEdge(from: number, to: number, weight?: number | weightFunc, info?: any) {
        this.vertexes[from].addEdge(new Edge(this.vertexes[from], this.vertexes[to], weight, info));
        if (!this.directed)
            this.vertexes[to].addEdge(new Edge(this.vertexes[to], this.vertexes[from], weight, info));
    }

    /**
     * Returns the value gotten from evaluating a given heuristic with given source and destination.
     * @param s The source.
     * @param d The destination.
     * @return {number} The distance between them according to the heuristic defined on this graphs.
     */
    public heuristicValue(s: number, d: number): number {
        if (this._heuristic)
            return this._heuristic(this.vertexes[s], this.vertexes[d]);
        return 0;
    }

    /**
     * Sets a heuristic for this graphs.
     * @param h The new heuristic.
     */
    public setHeuristic(h: (s: Vertex, d: Vertex) => number): void {
        this._heuristic = h;
    }

    /**
     * Gets the vertex in this graphs.
     * @return {Vertex[]}
     */
    get vertexes(): Vertex[] {
        return this._vertexes;
    }

    /**
     * Gets all edges from Graph.
     * @return {Edge[]}
     */
    get edges(): Edge[] {
        let es: Edge[] = [];
        this.vertexes.forEach((v) => v.edges.forEach((e) => es.push(e)));
        return es;
    }

    /**
     * Prints this graphs vertex and adjacency list.
     */
    public toString(): string {
        if (this._vertexes.length <= 0)
            return 'Empty graphs';
        return 'Graph:\n\t' + this.vertexes.join('\n\t');
    }
}