/**
 * @licence
 * Copyright (C) 2017 Hector J. Vasquez <ipi.vasquez@gmail.com>
 *
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