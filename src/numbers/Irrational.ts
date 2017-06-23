/**
 * @class Irrational represents an irrational number, however this class is
 * only used internally by maths.ts and it does not get exported from maths.ts.
 *
 * The goal of this class is to have full accuracy on irrational number such as
 * sqrt(n), e, pi, etc. This is how we preserve high accuracy in calculations and
 * operations like 'sqrt(n) * sqrt(n)' are always going to be 'n' and not an approximation
 * of n.
 */
export class Irrational {
    private expression: string;

    constructor(i?: string) {
        if (i === undefined || i === '')
            this.expression = '1';
        else
            ; // TODO: Evaluate with parser or whatever
    }

    public value(): number {
        return 1;
    }
}