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

/**
 * Introduction
 * Any math expression may be seen as a tree. An example of how maths.ts builds
 * an expression tree would be the next:
 * 'sqrt(a) * ln(b-c)' may be seen as a tree where '*' is the tree's root. e.g:
 *      *
 *     / \
 * sqrt   ln
 *   |     |
 *   a     -
 *        / \
 *       b   c
 *
 * Annotations: Node class is not ready yet. There are many improvements to
 * make. Node class is just functional for the functions implemented in
 * maths.ts.
 * Any improvement on this will be very welcome.
 */

import {gcd} from '../arithmetic';
import {InputError} from './Error';
import * as scope from './scope';

/**
 * Works as a helper on simplification of numbers. When a number is
 * converted to a string, this constant represents the maximum length that
 * string may have to be simplified.
 */
const VALID_FLOAT_LENGTH = 10;

/**
 * Inside the expressions, whenever numberPattern matches a string, it will be
 * considered as a number.
 */
export const numberRegex = /-?(((\d+)(\.\d+)?)|(\.\d+))/;
/**
 * Inside the expressions, whenever symbolPattern matches a string, it will be
 * considered as a symbol.
 */
export const symbolRegex = /[a-z]\w*/i;

/**
 * Node represents the basic tree node class. Any implementation of a tree
 * expression must be extended through Node internally.
 */
export default class Node {
    // The children of this
    public children: Node[] = [];
    // The exponent for this
    public exponent: Node | number = 1;
    // The parent of this node, when parent == undefined, this is the root
    public parent: Node;
    // Represents the sign of this expression
    private _positive: boolean = true;
    // Represents the type of the node
    public type: NodeType = NodeType.Constant;
    // The value of this (1, 2, 'x', '+', 'sin', etc...)
    public value: number | string = NaN;

    public static scope: any = scope;

    /**
     * Builds the tree for expression.
     * @param exp The expression to be represented with this.
     * @param parent The parent for this Node.
     */
    constructor(exp?: number | string | Node, parent?: Node) {
        this.parent = parent;

        if (isNumber(exp)) {
            // Assign a value and a type to this
            this.value = Number(exp);
            this.type = NodeType.Constant;
            this.rationalize();
        } else if (exp instanceof Node) {
            // Creates a copy of exp
            this.value = exp.value;
            this.value = exp.value;
            this.parent = exp.parent;
            this.type = exp.type;
            this.exponent = exp.exponent;
            this._positive = exp.positive;
            // This will recursively build each child
            for (let child of exp.children)
                this.children.push(new Node(child));
        } else if (typeof exp === 'string') {
            exp = formatString(exp);
            let pieces: string[] = breakPieces(exp);
            // Eliminates extra brackets
            while (pieces.length === 1) {
                exp = pieces[0];
                pieces = breakPieces(exp);
                if (pieces[0] === exp)
                    break;
            }
            // Build this tree from the pieces obtained
            buildTree(this, pieces);
        }
    }

    /**
     * Gets the value as a number for this node. In the event that there is
     * a variable in this expression, that variable must be declared in the
     * global scope or sent through the scope param in order to interpret
     * the variable in the expression, if a variable has no number value in
     * scope then the value returned will be undefined.
     * @param scope The scope in which some variables inside this will be
     * evaluated.
     * @return The value for this according to the scope provided. In the
     * event that a variable is missed in the scope it will return undefined.
     */
    public getNumberValue(scope?: any): number {
        let value;

        if (this.type === NodeType.Constant && typeof this.value === 'number')
            value = this.value;
        else if (this.type === NodeType.Operator)
            value = Node.operators[this.value]
                .fn(this.children[0], this.children[1], scope);
        else if (this.type === NodeType.Function)
            value = Node.functions[this.value].fn(this.children[0], scope);
        else
            try {
                value = scope[this.value];
            } catch (Error) {
                value = Node.constants[this.value];
            }

        if (this.exponent !== 1) {
            if (typeof this.exponent === 'number')
                value = Math.pow(value, this.exponent);
            else
                value = Math.pow(value, this.exponent.getNumberValue(scope));
        }

        return this._positive ? value : -value;
    }

    /**
     * Adds to this another value in a new Node.
     * @param s The expression to operate with.
     * @return A new Node with the value of this plus s.
     */
    public add(s: number | string | Node): Node {
        let n = new Node('0+0');
        n.children[0] = new Node(this);
        n.children[1] = new Node(s);
        n.simplify();
        return n;
    }

    /**
     * Subtracts to this another value in a new Node.
     * @param s The expression to operate with.
     * @return A new Node with the value of this minus s.
     */
    public subtract(s: number | string | Node): Node {
        let n = new Node('0-0');
        n.children[0] = new Node(this);
        n.children[1] = new Node(s);
        n.simplify();
        return n;
    }

    /**
     * Multiplies to this another value in a new Node.
     * @param s The expression to operate with.
     * @return A new Node with the value of this times s.
     */
    public multiply(s: number | string | Node): Node {
        let n = new Node('0*0');
        n.children[0] = new Node(this);
        n.children[1] = new Node(s);
        n.simplify();
        return n;
    }

    /**
     * Divides to this another value in a new Node.
     * @param s The expression to operate with.
     * @return A new Node with the value of this between s.
     */
    public divide(s: number | string | Node): Node {
        let n = new Node('0/0');
        n.children[0] = new Node(this);
        n.children[1] = new Node(s);
        n.simplify();
        return n;
    }

    /**
     * Powers to this another value in a new Node.
     * @param s The expression to operate with.
     * @return A new Node with the value of this pow s.
     */
    public pow(s: number | string | Node): Node {
        let n = new Node('0^0');
        n.children[0] = new Node(this);
        n.children[1] = new Node(s);
        n.simplify();
        return n;
    }

    /**
     * Changes this node's sign.
     */
    public negate(): void {
        this.positive = !this.positive;
    }

    /**
     * Converts this to a string.
     * @return The string that represents this.
     */
    public toString(): string {
        let s: string;
        if (this.type === NodeType.Function)
            s = this.value + '(' + this.children.join(', ') + ')';
        else if (this.type === NodeType.Operator)
            s = this.printChild(this.children[0]) + this.value +
                this.printChild(this.children[1]);
        else
            s = this.value + ''; // In case is a variable or a constant

        if (this._positive)
            return s;
        if (this.type === NodeType.Operator)
            return '-(' + s + ')';
        return '-' + s;
    }

    /**
     * Access the operators in Node's scope.
     * @return The operators in the scope.
     */
    static get operators(): any {
        return Node.scope.operators;
    }

    /**
     * Access the functions in Node's scope.
     * @return The functions in the scope.
     */
    static get functions(): any {
        return Node.scope.functions;
    }

    /**
     * Access the constants in Node's scope.
     * @return The constants in the scope.
     */
    static get constants(): any {
        return Node.scope.constants;
    }

    /**
     * Adds a constant to the scope.
     * @param c The constant to be added.
     * @param v The value the constant will get.
     */
    static setConstant(c: string, v: number) {

    }

    /**
     * Simplifies each children of this, then simplifies this. At this
     * moment simplify uses a very simple simplification that is yet waiting
     * to be completed.
     */
    public simplify(): void {
        // TODO: Exponents here?
        for (let child of this.children)
            child.simplify();
        let n = this.getNumberValue();
        // The most simple simplification
        if (this.type !== NodeType.Constant && !isNaN(n) &&
            (n === Math.floor(n) || (n + '').length < VALID_FLOAT_LENGTH)) {
            this.update(n);
            return;
        }

        if (this.type === NodeType.Operator)
        // TODO: There is still many work to do in simplification of nodes
            switch (this.value) {
                case '+':
                    break;
                case '-':
                    break;
                case '*':
                    this.simplifyProduct();
                    break;
                case '/':
                    this.simplifyDivision();
                    break;
                case '^':
                    break;
            }
    }

    /**
     * Simplifies this when it is a division.
     */
    private simplifyDivision(): void {
        if (Math.abs(this.children[1].getNumberValue()) === 1) {
            let aux = this.children[1].getNumberValue() === -1;
            this.update(this.children[0]);
            if (aux)
                this.negate();
            return;
        }
    }

    /**
     * Simplifies this when it is a product.
     */
    private simplifyProduct(): void {
        let aux: any;

        if (Math.abs(this.children[0].getNumberValue()) === 1) {
            aux = this.children[0].getNumberValue() === -1;
            this.update(this.children[1]);
            if (aux)
                this.negate();
            return;
        }
        if (Math.abs(this.children[1].getNumberValue()) === 1) {
            aux = this.children[1].getNumberValue() === -1;
            this.update(this.children[0]);
            if (aux)
                this.negate();
            return;
        }
    }

    /**
     * Whenever this.value is a number, it may be seen as a rational number.
     * If it has a decimal point then it is better to represent that value
     * as a fraction in order to keep accuracy on later operations.
     * Rationalize transforms this node to a fraction if this.value is a non
     * integer number.
     */
    public rationalize(): void {
        // Checks if there is no need to process a constant
        if (typeof this.value !== 'number'
            || Math.floor(this.value) === this.value)
            return;
        // Stringify value
        let n = '' + this.value;
        // Check how many digits does this.value have
        let nDigits = n.length - 1;
        // Checks how many of those digits are at the left of the decimal point
        let nIntDigits = (Math.round(this.value) + '').length;
        // Based on nIntDigits it creates a denominator for this.value
        let numerator = Number(n.replace('.', ''));
        let denominator = Math.pow(10, nDigits - nIntDigits);
        // Simplify before create fraction
        let common = gcd(Number(numerator), denominator);
        // Build this as a fraction
        this.type = NodeType.Operator;
        this.value = '/';
        this.children = [
            // new Node without decimal point
            new Node(numerator / common),
            // new Node being the denominator created
            new Node(denominator / common)
        ];
    }

    /**
     * Updates this to a new value or type of node.
     * @param n The new value.
     */
    public update(n: number | Node) {
        if (typeof n === 'number') {
            this.type = NodeType.Constant;
            this.value = n;
            this.children = [];
            this._positive = true;
            this.exponent = 1;
            this.rationalize();
        } else {
            this.type = n.type;
            this.value = n.value;
            this.children = n.children;
            this._positive = n._positive;
            this.exponent = n.exponent;
        }
    }

    /**
     * Returns whether this is positive or not.
     * @return true if this is positive, false otherwise.
     */
    get positive(): boolean {
        return this._positive;
    }

    /**
     * Returns whether this is positive or not.
     * @return true if this is positive, false otherwise.
     */
    get negative(): boolean {
        return !this.positive;
    }

    /**
     * Sets the sign of this.
     */
    set positive(value: boolean) {
        if (this.type === NodeType.Constant && this.positive !== value)
            this.value = -this.value;
        else
            this._positive = value;
    }

    /**
     * Sets the sign of this.
     */
    set negative(value: boolean) {
        this.positive = !value;
    }

    /**
     * Prints the child sent with or without parentheses according to this
     * operator's priority.
     * @param n The child to be printed.
     * @return The string as how n should be printed.
     */
    private printChild(n: Node): string {
        let nOp = Node.operators[n.value];
        if (nOp === undefined)
            return n.toString();

        let thisOp = Node.operators[this.value];
        if (nOp.priority >= thisOp.priority && n.value !== '/')
            return n.toString();

        return '(' + n.toString() + ')';
    }
}

/**
 * Represents the types which a Node can represent. The nodes can only be
 * operators, constants, functions or variables. Each one of this node types
 * have their own features that distinguish them from the others.
 */
export enum NodeType {
    Operator, // +, * ...
    Constant, // 1, 23, 32.1, -1
    Function, // log(1), sin(pi)
    Variable  // x, y, a...
}

/**
 * Builds a tree using node as a root.
 * @param node The root for the new tree.
 * @param pieces The pieces from where to build node.
 */
function buildTree(node: Node, pieces: string[]) {
    let flag;
    if (pieces.length === 2 && pieces[0] === '-')
        flag = pieces.shift();
    // Checking the expression actually is atomic
    if (pieces.length === 1)
        pieces = breakPieces(pieces[0]);
    // In case is atomic
    if (pieces.length === 1)
        switch (node.type = detectNodeType(pieces[0])) {
            case NodeType.Variable:
                node.value = pieces[0].match(symbolRegex)[0];
                break;
            case NodeType.Function:
                node.value = pieces[0].match(symbolRegex)[0];
                node.children = [
                    new Node(pieces[0].replace(node.value, ''), node)
                ];
                break;
            case NodeType.Constant:
                node.value = Number(pieces[0]);
                node.rationalize();
                break;
            default:
                throw new InputError('Something unexpected happened.');
        }
    else {
        let nodes: any = [];
        let priorI: number = -1;
        for (let i = 1; i < pieces.length; i++)
            // This if checks if pieces[i] is an operator and checks that
            // pieces[i - 1] is not an operator. If its and operator it
            // probably is -. Then checks the priority of the operator so it
            // keeps the record about where to cut the expression to keep
            // building this tree.
            if (Node.operators[pieces[i]] !== undefined &&
                Node.operators[pieces[i - 1]] === undefined &&
                (priorI < 0 || Node.operators[pieces[i]].priority <
                    Node.operators[pieces[priorI]].priority))
                priorI = i;
        // TODO: FACTORIAL! ---> ! operator exception
        // TODO: Exponents in exponent meant space!
        if ((node.value = pieces[priorI]) !== '^^') {
            node.type = NodeType.Operator;
            node.children.push(new Node(undefined, node));
            buildTree(node.children[0], pieces.slice(0, priorI));
            node.children.push(new Node(undefined, node));
            buildTree(node.children[1], pieces.slice(priorI + 1));
        } else {

        }
    }

    if (flag === '-')
        node.positive = false;
}

/**
 * Detects which kind of node the expression corresponds.
 * @param exp The expression to detect.
 * @return The type of node the expression is.
 */
function detectNodeType(exp: string): NodeType {
    let s;
    if (numberRegex.test(exp) && exp.match(numberRegex)[0] === exp)
        return NodeType.Constant;

    if (s = exp.match(symbolRegex)[0]) {
        if (exp.indexOf(s) === 0 && exp[s.length] === '(')
            return NodeType.Function;
        return NodeType.Variable;
    }

    return undefined;
}

/**
 * Splits the expression into the different nodes this expression will be
 * composed.
 * @param exp The expression to split.
 * @return The splitted expression.
 */
function breakPieces(exp: string): string[] {
    let parts: string[] = [];
    let part: string;

    for (let i = 0; i < exp.length; i++) {
        if (exp[i] === '(') {
            part = getBracketExp(exp.substring(i, exp.length));
            parts.push(part);
            i += part.length + 1;
        } else if (isNumeric(exp[i]) || exp[i] === '.') {
            part = exp.substring(i, exp.length).match(numberRegex)[0];
            parts.push(part);
            i += part.length - 1;
        } else if (isAlpha(exp[i])) {
            part = exp.substring(i, exp.length).match(symbolRegex)[0];
            if (exp[i + part.length] === '(')
                part += '(' +
                    getBracketExp(exp.substring(i + part.length, exp.length))
                    + ')';
            parts.push(part);
            i += part.length - 1;
        } else if (Node.operators[exp[i]] !== undefined)
            parts.push(exp[i]);
        else if (exp[i] === ')')
            throw new InputError({
                message: 'There is an extra closing bracket',
                input: exp
            });
    }

    return parts;
}

/**
 * Get the content from the first brackets on the expression given.
 * @param exp From where to get the expression.
 * @return The expression inside the first pair of brackets the expression has.
 */
function getBracketExp(exp: string): string {
    if (exp[0] !== '(')
        throw new InputError({
            message: 'The expression does not start with a bracket.',
            input: exp
        });

    let k, i;
    for (k = i = 1; k !== 0 && i < exp.length; i++)
        if (exp[i] === ')')
            k--;
        else if (exp[i] === '(')
            k++;
    if (k !== 0)
        throw new InputError({
            message: 'Expression with extra open bracket.',
            input: exp
        });

    return exp.substring(1, i - 1);
}

/**
 * Checks if a string or a number is a number.
 * @param n The value to be tested.
 * @return True if n is a number even being a string.
 */
function isNumber(n: any): boolean {
    if (typeof n === 'string') {
        let strictNumberRegex = /^-?(((\d+)(\.\d+)?)|(\.\d+))$/;
        return typeof n === 'number' || strictNumberRegex.test(n);
    }

    return typeof n === 'number';
}

/**
 * Checks if a char is alpha.
 * @param c The character to check, this is a string with length 1.
 * @return Whether c is or is not alpha.
 */
function isAlpha(c: string): boolean {
    return c.length === 1 && c.search(/[a-z]|[A-Z]/i) === 0;
}

/**
 * Checks if a char is numeric.
 * @param c The character to check, this is a string with length 1.
 * @return Whether c is or is not a number.
 */
function isNumeric(c: string): boolean {
    return c.length === 1 && c.search(/[0-9]/i) >= 0;
}

/**
 * Checks if a char is alphanumeric.
 * @param c The character to check, this is a string with length 1.
 * @return Whether c is or is not alpha or a number.
 */
function isAlphaNumeric(c: string): boolean {
    return c.length === 1 && c.search(/\w/i) >= 0;
}

/**
 * Formats an expression given in order to be processable by node constructor.
 * @param exp The expression to be formatted.
 * @return The expression formatted.
 */
function formatString(exp: string): string {
    // This two turns expressions like: ( exp ), ( exp), (exp ) into (exp).
    exp = exp
        .replace(/ +/g, '')
        .replace(/ *\( */g, '(')
        .replace(/ *\) */g, ')')
        .replace(/ *\+ */g, '+')
        .replace(/ *\* */g, '*')
        .replace(/ *- */g, '-')
        .replace(/ *\/ */g, '/')
        .replace(/ *\^ */g, '^');
    // Checks if there are empty expressions on input
    if (exp.length === 0 || exp.search(/\( *\)/) >= 0)
        throw new InputError('There cannot be empty expressions on input.');
    // Checks there are no errors on input
    let errorPattern =
        /(([*+\/^])([*+\/^])+)|(\(([*+\/^])+)|(([*+\/^])+\))/;
    if (exp.search(errorPattern) >= 0)
        throw new Error('There are two operators that does not suppose' +
            ' to be together: ' + exp + '.');

    return exp;
}