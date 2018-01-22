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
 * Generates a random integer in the range [lb, up).
 * @param lb The lower bound.
 * @param ub The upper bound.
 * @returns A random integer between lb and ub.
 */
export function randInt(lb: number, ub: number): number {
  return Math.floor(Math.random() * (ub - lb)) + lb;
}

/**
 * Calculates the factorial of a given number.
 * @param n The number from which to calculate factorial.
 * @returns n!
 */
export function factorial(n: number): number {
  let a = 1;

  for (let i = 2; i <= n; i++) {
    a *= i;
  }

  return a;
}
