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

import {sieveOfEratosthenes} from './sieve';

/**
 * Represents an array of prime numbers from 0 to 1100401, it helps to
 * prevent re-calculating every time an algorithm makes use of the
 * PRIMES of Eratosthenes algorithm.
 */
export const PRIMES = sieveOfEratosthenes();

/**
 * Factorizes a number.
 * @param n The number to be factorize.
 * @return An array containing all prime factors of n.
 */
export function getPrimeFactors(n: number): number[] {
  const factors = [];

  for (let i = 0; PRIMES[i] <= n; i++) {
    while (n % PRIMES[i] === 0) {
      factors.push(PRIMES[i]);
      n /= PRIMES[i];
    }
  }

  return factors;
}

/**
 * Gets the lowest common multiple for a set of numbers.
 * @param ns The numbers for calculating the lowest common multiple.
 * @return The lowest common multiple of all the numbers in the arguments.
 */
export function lcm(...ns: number[]): number {
  return ns.reduce((i, s) => {
    return s * i / gcd(i, s);
  });
}

/**
 * Gets the greatest common divisor from a set of numbers.
 * @param ns The numbers from where to get the greatest common divisor.
 * @return The common denominator between all numbers in the arguments.
 */
export function gcd(...ns: number[]): number {
  let common = 1;

  for (let i = 0; !isGCDDone(PRIMES[i], ns); i++) {
    while (isDivisible(PRIMES[i], ns)) {
      common *= PRIMES[i];
      for (let j = 0; j < ns.length; j++) {
        ns[j] /= PRIMES[i];
      }
    }
  }

  return common;
}

/**
 * Checks if there is no need to keep checking for more prime factors.
 * @param divisor The current factor.
 * @param ns The numbers from where the gcd is being calculated.
 * @return true if the gcd needs to finish now.
 */
function isGCDDone(divisor: number, ns: number[]): boolean {
  for (const n of ns) {
    if (divisor > n) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if a set of numbers are divisible between another.
 * @param divisor The divisor to check if it divides the other numbers.
 * @param ns The numbers to check if they are divisible.
 * @return true if all numbers in ns are divisible between divisor.
 */
function isDivisible(divisor: number, ns: number[]): boolean {
  for (const n of ns) {
    if (n % divisor !== 0) {
      return false;
    }
  }

  return true;
}
