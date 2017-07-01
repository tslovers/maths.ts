import {Node} from '../core/Node';
import {InputError} from "../core/Error";

export class Real {
    // TODO
    private number: Node;

    /**
     * Builds a node from a expression, a node or a Node. However, if the node built does not have
     * a number value (number.getNumberValue()), it will fail in this' construction.
     * @param n
     */
    constructor(n: string | number | Node) {
        this.number = new Node(n);

        let value = this.number.getNumberValue();
        if (value === undefined)
            throw new InputError(n + ' is not a valid Real number.');

        this.simplify();
    }

    /**
     * Transforms this.number to the most accurate yet simple expression of this.
     * To achieve this goal, this.simplify() transforms some nodes to rational instances,
     * factorizes each node and tries to simplify it.
     */
    public simplify(): void {
        // TODO: Everything
    }

    /**
     * Returns this as a number.
     * @return {number} this number value.
     */
    get numberValue(): number {
        return this.number.getNumberValue();
    }

    /**
     * Return the representation of this as a string.
     * @return {string} this as a string.
     */
    public toString(): string {
        return this.number.toString();
    }
}