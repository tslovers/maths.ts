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

import {ascending, criterion} from '../utils/comparisons';

/**
 * Executes the merge sort algorithm. When a logger its sent, it describes
 * each name of the execution and it logs it in logger.
 * @param a The array of T type elements to be sorted.
 * @param compare A function(a: T, b: T) that determines which element goes
 * first:
 *  If compare(a, b) < 0 then a comes first than b.
 *  If compare(a, b) > 0 then b comes first than a.
 *  If compare(a, b) = 0 then the order of a according to b does not matter.
 * @param logger An array of logs where the execution of the algorithm may
 * be described in each log.
 * @return The sorted array.
 */
export function mergeSort<T>(a: T[], compare: criterion = ascending): T[] {
  mSort(a, 0, a.length, compare);
  return a;
}

/**
 * The actual merge sort algorithm. Splits by two equal parts the array in each
 * recursion until it gets to arrays with only one elements, then orderly
 * joins them.
 * @param a The array containing the elements to sort.
 * @param p The index of the first element to sort.
 * @param r The index of the last element to sort.
 * @param compare The comparative criterion.
 */
function mSort<T>(a: T[], p: number, r: number, compare: criterion): void {
// Ends when there are only 1 elements to evaluate
  if ((r - p) > 1) {
// Gets the center of the array
    const q: number = Math.floor((p + r) / 2);
// Merge sort the first half of this collection
    mSort(a, p, q, compare);
// Merge sort the last half of this collection
    mSort(a, q, r, compare);
// Merges and sorts the two parts of the array
    merge(a, p, q, r, compare);
  }
}

/**
 * Merges orderly the two parts of the array in the array using two helper
 * arrays.
 * @param a The array holding the elements to sort.
 * @param p The index of the first element of the first part of the array.
 * @param q The index of the first element of the second part of the array.
 * @param r The upper bound index to sort.
 * @param compare The comparative criterion.
 */
function merge<T>(a: T[], p: number, q: number, r: number,
                  compare: criterion): void {
  let i: number;
  let j: number;
  const l1: T[] = a.slice(p, q); // Copy the first half
  const l2: T[] = a.slice(q, r); // Copy the last half

  i = j = 0;
// Orders from p to q
  for (let k = p; k < r; k++) {
    if (compare(l1[i], l2[j]) < 0 && l1.length !== i) {
      a[k] = l1[i++];
    } else {
      a[k] = l2[j++];
    }
  }
}
