import {expect} from 'chai';
import {Real} from '../src/numbers/Real';

let SLACK = 0.0001;

describe('numbers::Real', () => {
    it('Build and substitution', () => {
        let n = new Real('-.504');
        expect(n.toString()).to.equals('0 - 0.504');
        n = new Real('0.504');
        expect(n.toString()).to.equals('0.504');
        // expect(n.toString()).to.equals('1233/1000');
        // n.simplify();
    });

    it('Evaluation', () => {
        let n = new Real('-.504');
        expect(n.numberValue).to.equals(-0.504);
        n = new Real('-(-0.504)');
        expect(n.numberValue).to.equals(0.504);
        n = new Real('-(0.504)');
        expect(n.numberValue).to.equals(-0.504);
        n = new Real('--0.504');
        expect(n.numberValue).to.equals(0.504);
        n = new Real('0.504');
        expect(n.numberValue).to.equals(0.504);
        n = new Real('.504');
        expect(n.numberValue).to.equals(0.504);
    });

    // it('Simplification', () => {
    // TODO: Simplification in node or in subclasses?
    // });
});