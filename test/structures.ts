import {expect} from 'chai';
import * as structures from '../src/structures';

let SLACK = 0.0001;

describe('structures::BitSet', () => {
    let bs = new structures.BitSet();
    it('Testing', () => {
        expect(0).to.equals(0);
    });
});

describe('structures::Graph', () => {
    let g = new structures.graph.Graph(6);
    g.addEdge(0, 1);
    g.addEdge(1, 2);
    g.addEdge(2, 3);
    g.addEdge(3, 4);
    g.addEdge(4, 5);

    it('Testing', () => {
        // expect(bfs()).to.equals(0);
    });
});