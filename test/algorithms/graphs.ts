import * as algorithms from '../../src/algorithms';
import {expect} from 'chai';
import {Graph, Vertex} from '../../src/structures/graph';

let SLACK = 0.0001;

let g = new Graph(10);
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

describe('algorithms.graphs::bfs', () => {
    it('Reachable element', () => {
        let logger: any = [];
        expect(algorithms.graphs.bfs(g, 0, 5)).to.equals(true);
        expect(algorithms.graphs.bfs(g, 2, 5, logger)).to.equals(true);
        expect(logger.pop().stepInfo.depth).to.equals(2);
        expect(algorithms.graphs.bfs(g, 5, 8, logger)).to.equals(true);
        expect(logger.pop().stepInfo.depth).to.equals(3);
    });

    it('Unreachable element', () => {
        expect(algorithms.graphs.bfs(g, 3, 9, [])).to.equals(false);
        expect(algorithms.graphs.bfs(g, 1, 9)).to.equals(false);
    });
});

describe('algorithms.graphs::dfs', () => {
    it('Reachable element', () => {
        expect(algorithms.graphs.dfs(g, 0, 5, [])).to.equals(true);
        expect(algorithms.graphs.dfs(g, 2, 5)).to.equals(true);
    });

    it('Unreachable element', () => {
        expect(algorithms.graphs.dfs(g, 3, 9, [])).to.equals(false);
        expect(algorithms.graphs.dfs(g, 1, 9)).to.equals(false);
    });
});

describe('algorithms.graphs::idfs', () => {
    it('Reachable element', () => {
        let logger: algorithms.Logger = [];
        expect(algorithms.graphs.idfs(g, 0, 5, logger)).to.equals(true);
        expect(algorithms.graphs.idfs(g, 0, 5)).to.equals(true);
        expect(logger.pop().stepInfo.depth).to.equals(3);
    });

    it('Unreachable element', () => {
        expect(algorithms.graphs.idfs(g, 0, 9, [])).to.equals(false);
        expect(algorithms.graphs.idfs(g, 5, 9)).to.equals(false);
    });
});

describe('algorithms.graphs::ucs', () => {
    it('Reachable element', () => {
        let logger: algorithms.Logger = [];
        expect(algorithms.graphs.ucs(g, 0, 5)).to.equals(true);
        expect(algorithms.graphs.ucs(g, 0, 5, logger)).to.equals(true);
        expect(logger.pop().stepInfo.cost).to.equals(35);
        expect(algorithms.graphs.ucs(g, 2, 8, logger)).to.equals(true);
        expect(logger.pop().stepInfo.cost).to.equals(50);
    });

    it('Unreachable element', () => {
        expect(algorithms.graphs.ucs(g, 6, 9, [])).to.equals(false);
        expect(algorithms.graphs.ucs(g, 7, 9)).to.equals(false);
    });
});

g.setHeuristic((s: Vertex, d: Vertex) => Math.abs(d.id - s.id));

describe('algorithms.graphs::greedy', () => {
    it('Reachable element', () => {
        let logger: algorithms.Logger = [];
        expect(algorithms.graphs.greedySearch(g, 0, 8, logger)).to.equals(true);
        expect(algorithms.graphs.greedySearch(g, 2, 7)).to.equals(true);
    });

    it('Unreachable element', () => {
        expect(algorithms.graphs.greedySearch(g, 8, 9, [])).to.equals(false);
        expect(algorithms.graphs.greedySearch(g, 4, 9)).to.equals(false);
    });
});

describe('algorithms.graphs::aStar', () => {
    it('Reachable element', () => {
        let logger: algorithms.Logger = [];
        expect(algorithms.graphs.aStar(g, 0, 5, logger)).to.equals(true);
        expect(logger.pop().stepInfo.cost).to.equals(35);
        expect(algorithms.graphs.aStar(g, 5, 0, logger)).to.equals(true);
        expect(logger.pop().stepInfo.cost).to.equals(35);
        expect(algorithms.graphs.aStar(g, 0, 5)).to.equals(true);
    });

    it('Unreachable element', () => {
        expect(algorithms.graphs.aStar(g, 3, 9, [])).to.equals(false);
        expect(algorithms.graphs.aStar(g, 0, 9)).to.equals(false);
    });
});