import {expect} from 'chai';
import {Node} from '../src/core/Node';

let SLACK = 0.0001;

describe('core::Node', () => {
    it('Build and substitution', () => {
        let symbolNode = new Node('s ^ 2 *cos((pi))*s^(1/2)+((1^2))');
        let numberNode = new Node('(cos(pi)*log(e))+(1/3)+log(e)');
        expect(symbolNode.toString()).to.equals('s ^ 2 * cos( pi ) * s ^ ( 1 / 2 ) + 1 ^ 2');
        symbolNode.replace({'s': 'a'});
        expect(symbolNode.toString()).to.equals('a ^ 2 * cos( pi ) * a ^ ( 1 / 2 ) + 1 ^ 2');
        // TODO: Replace symbols with expressions
        expect(numberNode.toString()).to.equals('cos( pi ) * log( e ) + 1 / 3 + log( e )');
        expect(new Node(5).getNumberValue()).to.equals(5);
    });

    it('Evaluation', () => {
        let numberNode = new Node('(cos(pi)*log(e))+(1/3)+log(e)');
        let symbolNode = new Node('s^2*cos((pi))*s^(1/2)+((1^2))');
        expect(symbolNode.getNumberValue({s: 1})).to.equals(0);
        expect(symbolNode.getNumberValue({s: 2})).closeTo(-4.6568, SLACK);
        expect(numberNode.getNumberValue()).closeTo(1 / 3, SLACK);
    });

    // it('Simplification', () => {
    // TODO: Simplification in node or in subclasses?
    // });
});