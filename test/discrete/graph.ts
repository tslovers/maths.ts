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
import {aStar, bfs, dfs, greedySearch, idfs, ucs} from '../../src/graph';
import {Logger} from '../../src/algorithms';
import {expect} from 'chai';

const SLACK = 0.0001;
let g = new Graph();

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
        const logger: any = [];
        let solution = bfs(g, 0, 5);
        expect(solution.reachable).to.equals(true);
        solution = bfs(g, 2, 5, logger);
        expect(solution.reachable).to.equals(true);
        expect(logger.pop().info.depth).to.equals(2);
        solution = bfs(g, 5, 8);
        expect(solution.reachable).to.equals(true);
        expect(solution.depth).to.equals(3);
    });

    it('Unreachable element', () => {
        expect(bfs(g, 3, 9).reachable).to.equals(false);
        expect(bfs(g, 1, 9).reachable).to.equals(false);
    });
});

describe('graph::dfs', () => {
    it('Reachable element', () => {
        expect(dfs(g, 0, 5, []).reachable).to.equals(true);
        expect(dfs(g, 2, 5).reachable).to.equals(true);
    });

    it('Unreachable element', () => {
        expect(dfs(g, 3, 9, []).reachable).to.equals(false);
        expect(dfs(g, 1, 9).reachable).to.equals(false);
    });
});

describe('graph::idfs', () => {
    it('Reachable element', () => {
        const logger: Logger = [];
        let solution = idfs(g, 0, 5, logger);
        expect(solution.reachable).to.equals(true);
        solution = idfs(g, 0, 5);
        expect(solution.reachable).to.equals(true);
        expect(logger.pop().info.depth).to.equals(3);
        expect(solution.depth).to.equals(3);
    });

    it('Unreachable element', () => {
        expect(idfs(g, 0, 9, []).reachable)
            .to.equals(false);
        expect(idfs(g, 5, 9).reachable).to.equals(false);
    });
});

describe('graph::ucs', () => {
    it('Reachable element', () => {
        const logger: Logger = [];
        const solution = ucs(g, 0, 5, logger);
        expect(ucs(g, 0, 5).reachable).to.equals(true);
        expect(solution.reachable).to.equals(true);
        expect(solution.cost).to.equals(35);
        expect(ucs(g, 2, 8, logger).reachable).to.equals(true);
        expect(logger.pop().info.cost).to.equals(50);
    });

    it('Unreachable element', () => {
        expect(ucs(g, 6, 9, []).reachable).to.equals(false);
        expect(ucs(g, 7, 9).reachable).to.equals(false);
    });
});

// Next algorithms need an heuristic to be defined.
g.setHeuristic((s: Vertex, d: Vertex) => Math.abs(d.id - s.id));

describe('graph::greedy', () => {
    it('Reachable element', () => {
        const logger: Logger = [];
        expect(greedySearch(g, 0, 8, logger).reachable)
            .to.equals(true);
        expect(greedySearch(g, 2, 7).reachable).to.equals(true);
    });

    it('Unreachable element', () => {
        expect(greedySearch(g, 8, 9, []).reachable)
            .to.equals(false);
        expect(greedySearch(g, 4, 9).reachable).to.equals(false);
    });
});

describe('graph::aStar', () => {
    it('Reachable element', () => {
        const logger: Logger = [];
        const solution = aStar(g, 5, 0, logger);
        expect(aStar(g, 0, 5, logger).reachable)
            .to.equals(true);
        expect(logger.pop().info.cost).to.equals(35);
        expect(solution.reachable).to.equals(true);
        expect(solution.cost).to.equals(35);
        expect(aStar(g, 0, 5).reachable).to.equals(true);
    });

    it('Unreachable element', () => {
        expect(aStar(g, 3, 9, []).reachable)
            .to.equals(false);
        expect(aStar(g, 0, 9).reachable).to.equals(false);
    });
});
