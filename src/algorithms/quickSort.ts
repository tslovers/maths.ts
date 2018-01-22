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
 * Executes the quick sort algorithm.
 * When a logger its sent, it describes each name of the execution and it
 * logs it in logger.
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
export function quickSort<T>(a: T[], compare: criterion = ascending): T[] {
  qSort(a, 0, a.length - 1, compare);
  return a;
}

/**
 * The actual quick sort algorithm. Splits by two in each recursion, sorting
 * the pivot element until there are no more pivots to take.
 * @param a The array containing the elements to sort.
 * @param p The index of the first element to sort.
 * @param r The index of the last element to sort.
 * @param compare The comparative criterion.
 */
function qSort<T>(a: T[], p: number, r: number, compare: criterion): void {
  if (p < r) {
    const q: number = partition(a, p, r, compare);
    qSort(a, p, q - 1, compare);
    qSort(a, q + 1, r, compare);
  }
}

/**
 * Selects a pivot from where the array gets sorted. The pivot will be an
 * index and by the end of the respective qSort recursion, the element at
 * that position will remain there once the array its sorted.
 * @param a The array holding the elements to sort.
 * @param p The index of the first element to sort.
 * @param r The index of the last element to sort.
 * @param compare The comparative criterion.
 * @return The index of the next partition.
 */
function partition<T>(a: T[], p: number, r: number,
                      compare: criterion): number {
  let i: number = p - 1;

  for (let j = p; j < r; j++) {
    if (compare(a[j], a[r]) < 0) {
      swapPositions(a, ++i, j);
    }
  }
  swapPositions(a, ++i, r);

  return i;
}

/**
 * Swaps the positions of two elements in an array.
 * @param a The array holding the elements to swap.
 * @param i The index of one of the elements to swap.
 * @param j The index of one of the elements to swap.
 */
function swapPositions<T>(a: T[], i: number, j: number): void {
  let temp: T;
  temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}
