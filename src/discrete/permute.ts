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

import {randInt} from './integers';

/**
 * Permutes an array arr.length! times or perms times.
 * @param arr The array to permute.
 * @param perms The maximum number of times to permute.
 * @returns An array with perms permutations of arr.
 */
export function permute<T>(arr: T[], perms: number): T[][] {
// TODO function*?
  return [];
}

/**
 * Permutes an array arr.length! times or perms times. This algorithm tries
 * to permute the array given randomly in order to get more diversity on NP
 * problem solutions.
 * @param arr The array to permute.
 * @param perms The maximum number of times to permute.
 * @returns An array with perms permutations of arr.
 */
export function randPermute<T>(arr: T[], perms?: number): T[][] {
  const permutations: T[][] = [];

  while (permutations.length < perms) {
    let i = 0, j = 0;
    const perm = arr.slice();
    while (i === j && arr.length !== 1) {
      i = randInt(0, arr.length);
      j = randInt(0, arr.length);
    }
    perm[i] = arr[j];
    perm[j] = arr[i];
    permutations.push(perm);
  }

  return permutations;
}

/**
 * Generates a random permutation with numbers from 0 to n - 1.
 * @param n The size of the array.
 */
export function randPermutation(n: number): number[] {
  const perm: number[] = [];

  for (let i = 0; i < n; i++) {
    perm.push(i);
  }

  n = n * n;
  for (let i = 0; i < n; i++) {
    const a = randInt(0, perm.length),
      b = randInt(0, perm.length);
    const aux: number = perm[a];
    perm[a] = perm[b];
    perm[b] = aux;
  }

  return perm;
}
