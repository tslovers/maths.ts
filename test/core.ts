import {expect} from 'chai';
import {Node} from '../src/core/Node';

describe('core::Node', () => {
    let symbolNode = new Node('s^2*cos((pi))*s^(1/2)+((1^2))');
    let numberNode = new Node('(cos(pi)*log(e))+(1/3)+log(e)');

    it('symbolNode::toString', () => {
        expect(symbolNode.toString()).to.equals('s^2*cos(pi)*s^(1/2)+1^2');
    });

    it('symbolNode::values', () => {
        expect(symbolNode.getNumberValue({s: 1})).to.equals(0);
    });

    it('numberNode::toString', () => {
        expect(numberNode.toString()).to.equals('cos(pi)*log(e)+1/3+log(e)');
    });

    it('numberNode::values', () => {
        expect(numberNode.getNumberValue()).closeTo(1/3, 0.0001);
    });

    it('numberNode::simplify', () => {
        // expect(numberNode.getNumberValue()).to.equals(1/3);
    });
});