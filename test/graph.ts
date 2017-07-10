import * as graph from '../src/graph';
import {Logger} from '../src/algorithms';
import {expect} from 'chai';

let SLACK: number = 0.0001;
let g: graph.Graph;

describe('graph::Graph', () => {
    g = new graph.Graph(10);
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
});

describe('graph::bfs', () => {
    it('Reachable element', () => {
        let logger: any = [];
        expect(graph.algorithms.bfs(g, 0, 5)).to.equals(true);
        expect(graph.algorithms.bfs(g, 2, 5, logger)).to.equals(true);
        expect(logger.pop().stepInfo.depth).to.equals(2);
        expect(graph.algorithms.bfs(g, 5, 8, logger)).to.equals(true);
        expect(logger.pop().stepInfo.depth).to.equals(3);
    });

    it('Unreachable element', () => {
        expect(graph.algorithms.bfs(g, 3, 9, [])).to.equals(false);
        expect(graph.algorithms.bfs(g, 1, 9)).to.equals(false);
    });
});

describe('graph::dfs', () => {
    it('Reachable element', () => {
        expect(graph.algorithms.dfs(g, 0, 5, [])).to.equals(true);
        expect(graph.algorithms.dfs(g, 2, 5)).to.equals(true);
    });

    it('Unreachable element', () => {
        expect(graph.algorithms.dfs(g, 3, 9, [])).to.equals(false);
        expect(graph.algorithms.dfs(g, 1, 9)).to.equals(false);
    });
});

describe('graph::idfs', () => {
    it('Reachable element', () => {
        let logger: Logger = [];
        expect(graph.algorithms.idfs(g, 0, 5, logger)).to.equals(true);
        expect(graph.algorithms.idfs(g, 0, 5)).to.equals(true);
        expect(logger.pop().stepInfo.depth).to.equals(3);
    });

    it('Unreachable element', () => {
        expect(graph.algorithms.idfs(g, 0, 9, [])).to.equals(false);
        expect(graph.algorithms.idfs(g, 5, 9)).to.equals(false);
    });
});

describe('graph::ucs', () => {
    it('Reachable element', () => {
        let logger: Logger = [];
        expect(graph.algorithms.ucs(g, 0, 5)).to.equals(true);
        expect(graph.algorithms.ucs(g, 0, 5, logger)).to.equals(true);
        expect(logger.pop().stepInfo.cost).to.equals(35);
        expect(graph.algorithms.ucs(g, 2, 8, logger)).to.equals(true);
        expect(logger.pop().stepInfo.cost).to.equals(50);
    });

    it('Unreachable element', () => {
        expect(graph.algorithms.ucs(g, 6, 9, [])).to.equals(false);
        expect(graph.algorithms.ucs(g, 7, 9)).to.equals(false);
    });
});

// Next algorithms need an heuristic to be defined.
g.setHeuristic((s: graph.Vertex, d: graph.Vertex) => Math.abs(d.id - s.id));

describe('graph::greedy', () => {
    it('Reachable element', () => {
        let logger: Logger = [];
        expect(graph.algorithms.greedySearch(g, 0, 8, logger)).to.equals(true);
        expect(graph.algorithms.greedySearch(g, 2, 7)).to.equals(true);
    });

    it('Unreachable element', () => {
        expect(graph.algorithms.greedySearch(g, 8, 9, [])).to.equals(false);
        expect(graph.algorithms.greedySearch(g, 4, 9)).to.equals(false);
    });
});

describe('graph::aStar', () => {
    it('Reachable element', () => {
        let logger: Logger = [];
        expect(graph.algorithms.aStar(g, 0, 5, logger)).to.equals(true);
        expect(logger.pop().stepInfo.cost).to.equals(35);
        expect(graph.algorithms.aStar(g, 5, 0, logger)).to.equals(true);
        expect(logger.pop().stepInfo.cost).to.equals(35);
        expect(graph.algorithms.aStar(g, 0, 5)).to.equals(true);
    });

    it('Unreachable element', () => {
        expect(graph.algorithms.aStar(g, 3, 9, [])).to.equals(false);
        expect(graph.algorithms.aStar(g, 0, 9)).to.equals(false);
    });
});