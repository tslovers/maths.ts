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

import {InputError} from './Error';
// import {getPrimeFactors} from '../utils';
// import {getCommonDenominator} from "../utils/sieve";

export const numberPattern = /((\d+)(\.\d+)?)|(\.\d+)/;
export const symbolPattern = /[a-z]\w*/i;

let operators: any = {
    '+': {
        priority: 0,
        params: 2,
        fn: (nodeA: Node, nodeB: Node, scope: any) => {
            let a = nodeA.getNumberValue(scope), b = nodeB.getNumberValue(scope);
            if (a !== undefined && b !== undefined)
                return a + b;
            return undefined;
        }
    },
    '-': {
        priority: 0,
        params: 2,
        fn: (nodeA: Node, nodeB: Node, scope: any) => {
            let a = nodeA.getNumberValue(scope), b = nodeB.getNumberValue(scope);
            if (a !== undefined && b !== undefined)
                return a - b;
            return undefined;
        }
    },
    '*': {
        priority: 1,
        params: 2,
        fn: (nodeA: Node, nodeB: Node, scope: any) => {
            let a = nodeA.getNumberValue(scope), b = nodeB.getNumberValue(scope);
            if (a !== undefined && b !== undefined)
                return a * b;
            return undefined;
        }
    },
    '/': {
        priority: 1,
        params: 2,
        fn: (nodeA: Node, nodeB: Node, scope: any) => {
            let a = nodeA.getNumberValue(scope), b = nodeB.getNumberValue(scope);
            if (a !== undefined && b !== undefined)
                return a / b;
            return undefined;
        }
    },
    '^': {
        priority: 2,
        params: 2,
        fn: (nodeA: Node, nodeB: Node, scope: any) => {
            let a = nodeA.getNumberValue(scope), b = nodeB.getNumberValue(scope);
            if (a !== undefined && b !== undefined)
                return Math.pow(a, b);
            return undefined;
        }
    },
    '!': {
        priority: 3,
        params: 1,
        fn: (node: Node, scope: any) => {
            let aux;
            if ((aux = node.getNumberValue(scope)) !== undefined)
                return fact(aux);
            return aux;

            function fact(i: number): number {
                if (i < 0 || Math.floor(i) === i)
                    throw new InputError('At this moment we are only capable to calculate positive integers[0, inf).');
                if (i < 2)
                    return 1;
                return i * fact(i - 1);
            }
        }
    }
};

let functions: any = {
    sin: {
        fn: (node: Node, scope?: any) => {
            let aux: number;
            if ((aux = node.getNumberValue(scope)) !== undefined)
                return Math.sin(aux);
            return aux;
        }
    },
    cos: {
        fn: (node: Node, scope?: any) => {
            let aux: number;
            if ((aux = node.getNumberValue(scope)) !== undefined)
                return Math.cos(aux);
            return aux;
        }
    },
    tan: {
        fn: (node: Node, scope?: any) => {
            let aux: number;
            if ((aux = node.getNumberValue(scope)) !== undefined)
                return Math.tan(aux);
            return aux;
        }
    },
    asin: {
        fn: (node: Node, scope?: any) => {
            let aux: number;
            if ((aux = node.getNumberValue(scope)) !== undefined)
                return Math.asin(aux);
            return aux;
        }
    },
    acos: {
        fn: (node: Node, scope?: any) => {
            let aux: number;
            if ((aux = node.getNumberValue(scope)) !== undefined)
                return Math.acos(aux);
            return aux;
        }
    },
    atan: {
        fn: (node: Node, scope?: any) => {
            let aux: number;
            if ((aux = node.getNumberValue(scope)) !== undefined)
                return Math.atan(aux);
            return aux;
        }
    },
    log: {
        fn: (node: Node, scope?: any) => {
            let aux: number;
            if ((aux = node.getNumberValue(scope)) !== undefined)
                return Math.log(aux);
            return aux;
        }
    }
};

let constants: any = {
    e: Math.E,
    pi: Math.PI
};
constants.E = constants.e;
constants.PI = constants.pi;

/**
 * Expression can be seen as trees. An example of how maths.ts build expression threes:
 * 'sqrt(a) * ln(b-c)' may be seen as a tree where '*' operator is the tree's root.
 *
 *       *
 *      / \
 *  sqrt   ln
 *    |     |
 *    a     -
 *         / \
 *        b   c
 *
 *  @class Node is going to be the basic tree node class. Any implementation of three must be extended with Node.
 *
 *  Notes: Still deciding if Node should be exported outside maths.ts or just used inside exporting only
 *  it's subclasses. Comments on this are welcome.
 */
export class Node {
    public children: Node[];
    public name: string | number;
    public parent: Node;
    public type: NodeType;

    public static scope: any = {
        functions: functions,
        constants: constants,
        operators: operators,
        irrationals: {e: true, E: true, pi: true, PI: true}
    };

    /**
     * Builds a little tree from s.
     * @param s May be a string or an array. It is highly recommended to send s as a string representing the
     *  expression instead of an array. The array constructor must only be used internally by this.
     * @param parent
     */
    constructor(s: number | string | string[] | Node, parent?: Node) {
        this.parent = parent;

        if (typeof s === 'number') {
            this.name = s;
            this.type = NodeType.Constant;
            return;
        }

        if (!(s instanceof Node) && typeof s !== 'string' && s.length === 1)
            s = s[0];

        if (s instanceof Node) {
            this.name = typeof s.name === 'number' ? s.name : s.name.toString();
            this.parent = s.parent;
            this.type = s.type;
            if (s.children !== undefined)
                this.children = s.children.map(Node.newNode);
        } else if (typeof s === 'string') // Is string then
            this.buildTree(this.separate(Node.formatString(s)));
        else if (s.length === 0) // Is an array with 0 elements, hence, invalid
            throw new InputError('There is something wrong about your input: ' +
                (this.parent ? this.parent.toString() : 'unknown') + '.');
        else // Is an array with 2 or more elements so skip the separating part
            this.buildTree(s);
    }

    /**
     * Prints a child according to this node operator's priority. The intention is that this.toString
     * prints correctly the brackets needed.
     * @param n
     * @return {string}
     */
    private childString(n: number): string {
        let child = this.children[n];
        let thisP = Node.scope.operators[this.name].priority;
        let childP = Node.scope.operators[child.name] !== undefined ? Node.scope.operators[child.name].priority : Infinity;

        if (childP !== undefined && thisP >= childP && thisP === 2)
            return '( ' + child.toString() + ' )';
        return child.toString();
    }

    /**
     * Separates the input into all candidates for a new node.
     * @param s The formatted string.
     * @param children The array where to store the candidates.
     * @return {string[]} Candidate nodes.
     */
    public separate(s: string, children: string[] = []): string[] {
        let i = 0, j = s[0] === '(' ? 1 : 0;

        if (s.length === 0)
            return children;

        if (Node.isAlpha(s[i]))
            i = s.match(symbolPattern)[0].length;
        else if (Node.isNumeric(s[i]) || s[i] === '.')
            i = s.match(numberPattern)[0].length;
        else if (Node.scope.operators[s[i]] !== undefined)
            i++;
        else if (s[i] === ')')
            throw new InputError('There is a extra closing bracket.');

        // Avoids it when there is a bracket after operators or numbers.
        if (s[i] === '(' && (Node.isAlpha(s[0]) || i === 0)) {
            i++;
            let flag = true;
            for (let k = 0; i < s.length && flag; i++)
                if (s[i] === '(')
                    k++;
                else if (s[i] === ')' && k > 0)
                    k--;
                else if (s[i] === ')')
                    flag = false;
            if (flag)
                throw new InputError('There is a unclosed bracket');
        }

        children.push(s.substring(j, i - j));
        return this.separate(s.substring(i, s.length), children);
    }

    /**
     * Builds a tree with this node as a root.
     * @param elements The elements obtained from separate.
     */
    public buildTree(elements: string[]): void {
        if (elements.length === 0)
            throw new InputError('Node cannot be built because of wrong input: ' +
                (this.parent ? this.parent.toString() : 'unknown') + '.');

        if (elements.length === 1) {
            if (elements[0][0] === '(' ||
                (elements[0].search(/-?[a-z]\w*\(.*\)/i) < 0 &&
                elements[0].search(/\/|\*|\+|-|\^/i) >= 0 &&
                elements[0].search(/-/i) !== 0))
            // If this it means te expression may be separated even more despite there is only one element
                this.buildTree(this.separate(Node.formatString(elements[0])));
            else {
                // This expression it's ready for being a new node
                this.name = elements[0];
                if (elements[0].search(symbolPattern) >= 0) {
                    if (elements[0].search(/[()]/) >= 0) {
                        // It must be a function
                        this.type = NodeType.Function;
                        // As a function there are some exceptions that must be caught
                        if (elements[0].search(/sqrt\(/) === 0) {
                            this.buildTree(this.separate(elements[0].replace('sqrt', '(') + '^(1/2))'));
                        } else {
                            this.name = elements[0].match(symbolPattern)[0];
                            this.children = [new Node(elements[0].substring(this.name.length, elements[0].length), this)];
                        }
                    } else {
                        this.type = NodeType.Symbol;
                        this.name = elements[0];
                    }
                } else if (elements[0].search(numberPattern) >= 0) {
                    this.type = NodeType.Constant;
                    this.name = Number(elements[0]);
                } else
                    throw new InputError('WTF?');
            }
        } else {
            let curOp = -1;
            for (let i = 0; i < elements.length; i++) { // Finds where to split the array
                if (Node.scope.operators[elements[i]] !== undefined &&
                    (curOp < 0 || Node.scope.operators[elements[i]].priority < Node.scope.operators[elements[curOp]].priority))
                    curOp = i;
            }

            if (curOp < 0)
                throw new InputError('Node cannot be built because of wrong input: ' +
                    (this.parent ? this.parent.toString() : elements) + '.');

            this.type = NodeType.BinaryOperator;
            this.name = elements[curOp];
            this.children = [
                new Node(elements.slice(0, curOp), this),
                new Node(elements.slice(curOp + 1, elements.length), this)
            ];
        }
    }

    /**
     * Clones this node deeply.
     * @return {Node} A copy of this node.
     */
    public clone(): Node {
        return new Node(this.toString());
    }

    /**
     * Returns an approximate value for this if it can be solved.
     * @return {number} The value of this if there is.
     */
    public getNumberValue(scope?: any): number {
        if (this.type === NodeType.Constant && typeof this.name === 'number')
            return this.name;
        else if (this.type === NodeType.Symbol && Node.scope.constants[this.name] !== undefined)
            return Node.scope.constants[this.name];
        else if (this.type === NodeType.BinaryOperator)
            return Node.scope.operators[this.name].fn(this.children[0], this.children[1], scope);
        else if (this.type === NodeType.Function)
            return Node.scope.functions[this.name].fn(this.children[0], scope);
        else if (this.type === NodeType.Symbol && scope !== undefined && scope[this.name] !== undefined)
            return scope[this.name];
        return undefined;
    }

    /**
     * Replace a given constant in the expression.
     * @param scope
     */
    public replace(scope: any): void {
        if (this.type === NodeType.Symbol && scope[this.name] !== undefined) {
            this.name = scope[this.name] + '';
            let match;
            if ((match = this.name.match(symbolPattern)) && match[0] === this.name)
                this.type = NodeType.Symbol;
            else if ((match = this.name.match(numberPattern)) && match[0] === this.name)
                this.type = NodeType.Constant;
            else
                throw new InputError("The replacements must be a symbol or a number");
        } else if (this.type === NodeType.BinaryOperator) {
            this.children[0].replace(scope);
            this.children[1].replace(scope);
        } else if (this.type === NodeType.Function)
            this.children[0].replace(scope);
    }

    /**
     * Prints the representation of this node as an expression by seeking on its children.toString().
     * @return {string} This node as an expression.
     */
    public toString(): string {
        let out = '';

        if (this.type === NodeType.BinaryOperator)
            out += this.childString(0) + ' ' + this.name + ' ' + this.childString(1);
        else if (this.type === NodeType.Function)
            out += this.name + '( ' + this.children[0] + ' )';
        else
            out += this.name;

        return out;
    }

    /**
     * TODO: Only for debugging. Returns the tree structure going through it using DFS.
     * @param scope
     * @return {string}
     */
    public detailedChildrenString(scope?: any): string {
        let out = this.name + ': ' + NodeType[this.type] + ' --- Value: ' + this.getNumberValue(scope) + '\n';

        if (this.type === NodeType.BinaryOperator) {
            out += 'Children: [' + this.children[0] + ', ' + this.children[1] + ']\n';
            out += this.children[0].detailedChildrenString(scope);
            out += this.children[1].detailedChildrenString(scope);
        } else if (this.type === NodeType.Function) {
            out += 'Child: ' + this.children[0] + '\n';
            out += this.children[0].detailedChildrenString(scope);
        }

        return out;
    }

    /** Static methods */

    /**
     * Checks if a char is alpha.
     * @param c The character to check.
     * @return {boolean} Whether c is or is not alpha.
     */
    protected static isAlpha(c: string): boolean {
        return c.length === 1 && c.search(/[a-z]|[A-Z]/i) >= 0;
    }

    /**
     * Checks if a char is numeric.
     * @param c The character to check.
     * @return {boolean} Whether c is or is not a number.
     */
    protected static isNumeric(c: string): boolean {
        return c.length === 1 && c.search(/[0-9]/i) >= 0;
    }

    /**
     * Checks if a char is alphanumeric.
     * @param c The character to check.
     * @return {boolean} Whether c is or is not alpha or a number.
     */
    protected static isAlphaNumeric(c: string): boolean {
        return c.length === 1 && c.search(/\w/i) >= 0;
    }

    /**
     * Transforms the input string into a string readable for this and checks possible errors on input.
     * Notes:
     *  It is recommended to avoid ambiguity.
     * @param s
     * @return {string}
     */
    protected static formatString(s: string): string {
        // This two turns expressions like: ( exp ), ( exp), (exp ) into (exp).
        s = s.replace(/\( */g, '(');
        s = s.replace(/ *\)/g, ')');
        s = s.replace(/ *\+ */g, '+');
        s = s.replace(/ *\* */g, '*');
        s = s.replace(/ *- */g, '-');
        s = s.replace(/ *\/ */g, '/');
        s = s.replace(/ *\^ */g, '^');
        s = s.replace(/ +/g, '*');
        s = s.replace(/--/g, '');

        if (s[0] === '-')
            s = '0' + s;
        // Checks if there are empty expressions on input
        if (s.length === 0 || s.search(/\( *\)/) >= 0)
            throw new InputError('There cannot be empty expressions on input.');
        // Checks there are no errors on input
        if (s.search(/(([*+\/^-])([*+\/^])+)|(\(([*+\/^])+)|(([*+\/^-])+\))/) >= 0)
            throw new Error('There are two operators that does not suppose to be together: ' + s + '.');

        return s;
    }

    /**
     * Sets a new variable to be used in expressions.
     * @param c The new constant.
     * @param v Its value.
     * @param rational Whether its irrational or not
     */
    public static setConstant(c: string, v: number, rational: boolean = true): void {
        Node.scope.constants[c] = v;
        if (rational)
            Node.scope.irrationals[c] = true;
    }

    /**
     * Sets a new variable to be used in expressions.
     * @param f The new function.
     * @param fn Its function.
     */
    public static setFunction(f: string, fn: (n: Node) => number): void {
        Node.scope.functions[f] = {
            fn: fn
        };
    }

    /**
     * Returns a new node built from s.
     * @param s The expression or node from where to build the new node.
     * @return {Node} The node created.
     */
    public static newNode(s: string | Node): Node {
        return new Node(s);
    }
}

/**
 * Nodes might be (key: NodeType):
 * 0. Function.
 * 1. BinaryOperator.
 * 2. Constant.
 * 3. Symbol.
 */
export enum NodeType {
    Function,
    BinaryOperator,
    Constant,
    Symbol
}
