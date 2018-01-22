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

export type criterion = (x: any, y: any) => number;

/**
 * Checks if an array is in ascending order.
 * @param a The array to be checked.
 * @param compare An optional function to sent in case the commonly used a >
 * b does not fit the description of the array elements.
 * @return true if the array is sorted upwardly, false otherwise.
 */
export function isAscendingArray(a: any[],
                                 compare: criterion = ascending): boolean {
  for (let i = 1; i < a.length; i++) {
    if (compare(a[i - 1], a[i]) > 0) {
      return false;
    }
  }

  return true;
}

/**
 * Checks if an array is in descending order.
 * @param a The array to be checked.
 * @param compare An optional function to sent in case the commonly used
 * a > b does not fit the description of the array elements.
 * @return true if the array is sorted backwardly, false otherwise.
 */
export function isDescendingArray(a: any[], compare: criterion = descending) {
  for (let i = 1; i < a.length; i++) {
    if (compare(a[i - 1], a[i]) > 0) {
      return false;
    }
  }

  return true;
}

/**
 * The standard function checking relationship between a and b.
 * @param a a > b.
 * @param b a > b.
 * @return 0 if a equals b, 1 if a > b, -1 if b < a of a or b are undefined.
 */
export function ascending(a: any, b: any): number {
  if (a === undefined || b === undefined) {
    return -1;
  }
  if (a === b) {
    return 0;
  }
  if (a < b) {
    return -1;
  }
  return 1;
}

/**
 * The standard function checking relationship between a and b.
 * @param a a < b.
 * @param b a < b.
 * @return 0 if a equals b, 1 if a < b, -1 if b > a of a or b are undefined.
 */
export function descending(a: any, b: any): number {
  if (a === undefined || b === undefined) {
    return -1;
  }
  if (a === b) {
    return 0;
  }
  if (a < b) {
    return 1;
  }
  return -1;
}
