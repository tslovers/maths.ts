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

import {BitSet} from 'std.ts';

/**
 * Default PRIMES's max prime number.
 */
const LIMIT = 1100401;

/**
 * Emulates the PRIMES of Eratosthenes algorithm for finding all prime
 * numbers up to a given limit.
 * @param max The last number this algorithm will reach.
 * @return An array with all prime numbers from 0 to max.
 */
export function sieveOfEratosthenes(max: number = LIMIT): number[] {
  const bs = new BitSet(max);
  const maxPrimeSqrt = Math.round(Math.sqrt(max));
  const primes = [];

  for (let i = 2; i <= maxPrimeSqrt; i++) {
    if (!bs.get(i)) {
      primes.push(i);
      for (let j = 0; j < max; j += i) {
        bs.set(j, true);
      }
    }
  }
  for (let i = maxPrimeSqrt + ((maxPrimeSqrt & 1) ? 2 : 1);
       i < max; i += 2) {
    if (!bs.get(i)) {
      primes.push(i);
    }
  }

  return primes;
}
