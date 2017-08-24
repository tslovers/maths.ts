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

import {Graph, Vertex} from '../../src/structures';
import {aStar, bfs, dfs, greedySearch, idfs, ucs} from '../../src/discrete';
import {Logger} from '../../src/utils';
import {expect} from 'chai';

let SLACK: number = 0.0001;
let g: Graph = new Graph();

describe('structures::Graph', () => {
    g = new Graph(10);
    g.addEdge(0, 1, 15);
    g.addEdge(0, 2, 25);
    g.addEdge(1, 4, 10);
    g.addEdge(1, 7, 5);
    g.addEdge(1, 8, 25);
    g.addEdge(2, 3, 10);
    g.addEdge(2, 4, 20);
    g.addEdge(4, 5, 10);
    g.addEdge(4, 6, 5);
    g.addEdge(7, 8, 15);

    it('Build', () => {
        expect(g.edges.length).to.equals(20); // Bidirectional graph
        expect(g.vertexes.length).to.equals(10);
    });
});

describe('graph::bfs', () => {
    it('Reachable element', () => {
        let logger: any = [];
        expect(bfs(g, 0, 5)).to.equals(true);
        expect(bfs(g, 2, 5, logger)).to.equals(true);
        expect(logger.pop().stepInfo.depth).to.equals(2);
        expect(bfs(g, 5, 8, logger)).to.equals(true);
        expect(logger.pop().stepInfo.depth).to.equals(3);
    });

    it('Unreachable element', () => {
        expect(bfs(g, 3, 9, [])).to.equals(false);
        expect(bfs(g, 1, 9)).to.equals(false);
    });
});

describe('graph::dfs', () => {
    it('Reachable element', () => {
        expect(dfs(g, 0, 5, [])).to.equals(true);
        expect(dfs(g, 2, 5)).to.equals(true);
    });

    it('Unreachable element', () => {
        expect(dfs(g, 3, 9, [])).to.equals(false);
        expect(dfs(g, 1, 9)).to.equals(false);
    });
});

describe('graph::idfs', () => {
    it('Reachable element', () => {
        let logger: Logger = [];
        expect(idfs(g, 0, 5, logger)).to.equals(true);
        expect(idfs(g, 0, 5)).to.equals(true);
        expect(logger.pop().stepInfo.depth).to.equals(3);
    });

    it('Unreachable element', () => {
        expect(idfs(g, 0, 9, [])).to.equals(false);
        expect(idfs(g, 5, 9)).to.equals(false);
    });
});

describe('graph::ucs', () => {
    it('Reachable element', () => {
        let logger: Logger = [];
        expect(ucs(g, 0, 5)).to.equals(true);
        expect(ucs(g, 0, 5, logger)).to.equals(true);
        expect(logger.pop().stepInfo.cost).to.equals(35);
        expect(ucs(g, 2, 8, logger)).to.equals(true);
        expect(logger.pop().stepInfo.cost).to.equals(50);
    });

    it('Unreachable element', () => {
        expect(ucs(g, 6, 9, [])).to.equals(false);
        expect(ucs(g, 7, 9)).to.equals(false);
    });
});

// Next algorithms need an heuristic to be defined.
g.setHeuristic((s: Vertex, d: Vertex) => Math.abs(d.id - s.id));

describe('graph::greedy', () => {
    it('Reachable element', () => {
        let logger: Logger = [];
        expect(greedySearch(g, 0, 8, logger)).to.equals(true);
        expect(greedySearch(g, 2, 7)).to.equals(true);
    });

    it('Unreachable element', () => {
        expect(greedySearch(g, 8, 9, [])).to.equals(false);
        expect(greedySearch(g, 4, 9)).to.equals(false);
    });
});

describe('graph::aStar', () => {
    it('Reachable element', () => {
        let logger: Logger = [];
        expect(aStar(g, 0, 5, logger)).to.equals(true);
        expect(logger.pop().stepInfo.cost).to.equals(35);
        expect(aStar(g, 5, 0, logger)).to.equals(true);
        expect(logger.pop().stepInfo.cost).to.equals(35);
        expect(aStar(g, 0, 5)).to.equals(true);
    });

    it('Unreachable element', () => {
        expect(aStar(g, 3, 9, [])).to.equals(false);
        expect(aStar(g, 0, 9)).to.equals(false);
    });
});