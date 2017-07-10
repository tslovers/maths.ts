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

import {Node, NodeType} from './Node';
import {InputError} from "./Error";

export class Real {
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
        this.number = Real.simplifyNode(this.number);
    }

    /**
     * Simplifies a given node to get the most accurate representation with the fewest child nodes.
     * @param number The node representing the number to simplify.
     * @return {Node} The simplified node
     */
    private static simplifyNode(number: Node): Node {
        if (number.type === NodeType.Function || number.type === NodeType.BinaryOperator)
            for (let i = 0; i < number.children.length; i++)
                number.children[i] = this.simplifyNode(number.children[i]); // Simplifies each children
        else if (number.type === NodeType.Constant)
            number = this.processConstant(number); // Process number as a constant

        return number;
    }

    /**
     * Transforms a number to an accurate representation. Floating point numbers are transformed into rational numbers.
     * @param number The node representing the number to be processed.
     * @return {Node} The node representing the number transformed into a rational representation of it.
     */
    private static processConstant(number: Node): Node {
        if (typeof number.name !== 'number' || Math.floor(number.name) === number.name)
            return number;

        let n: string = '' + number.name;
        let nDigits = n.length - 1;
        let nIntDigits = (Math.round(number.name) + '').length;
        let denominator = Math.pow(10, nDigits - nIntDigits);
        return new Node(n.replace('.', '') + '/' + denominator);
    }

    /**
     * Returns this as a number.
     * @return This number value.
     */
    get numberValue(): number {
        return this.number.getNumberValue();
    }

    /**
     * Return the representation of this as a string.
     * @return This as a string.
     */
    public toString(): string {
        return this.number.toString();
    }
}