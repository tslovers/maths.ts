import {BitSet} from '../structures';

/**
 * Default sieve's max prime number.
 * @type {number}
 */
const SIEVE_MAX_PRIME = 1100401;

/**
 * Builds a sieve of prime numbers represented as an Array.
 * @param maxPrime The sieve upper bound.
 * @return {Array} A sieve with all prime numbers from 0 to maxPrime.
 */
export function getSieve(maxPrime: number = SIEVE_MAX_PRIME): number[] {
    let bs = new BitSet(maxPrime);
    let maxPrimeSqrt = Math.round(Math.sqrt(maxPrime));
    let sieve = [];

    for (let i = 2; i <= maxPrimeSqrt; i++)
        if (!bs.get(i)) {
            sieve.push(i);
            for (let j = 0; j < maxPrime; j += i)
                bs.set(j, true);
        }
    for (let i = maxPrimeSqrt + ((maxPrimeSqrt & 1) ? 2 : 1); i < maxPrime; i += 2)
        if (!bs.get(i))
            sieve.push(i);

    return sieve;
}

/**
 * Represents a sieve of prime numbers from 0 to 1100401, it helps to prevent re-calculating every time
 * an algorithm makes use of getSieve().
 * @type {number[]}
 */
export const sieve = getSieve();

/**
 * Factorizes a number.
 * @param n The number to be factorize.
 * @return {Array} An array containing all prime factors of n.
 */
export function getPrimeFactors(n: number): number[] {
    let factors = [];

    for (let i = 0; sieve[i] <= n; i++)
        while (n % sieve[i] === 0) {
            factors.push(sieve[i]);
            n /= sieve[i];
        }

    return factors;
}

export function getCommonDenominator(n1: number, n2: number): number {
    let common = 1;

    for (let i = 0; sieve[i] <= n1 && sieve[i] <= n2; i++)
        while (n1 % sieve[i] === 0 && n2 % sieve[i] === 0) {
            common *= sieve[i];
            n1 /= sieve[i];
            n2 /= sieve[i];
        }

    return common;
}
