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
 * Gets a random natural number given a range.
 * @param lowerBound The lowest number possible.
 * @param upperBound The greatest number possible.
 * @return A random natural number in [lowerBound, upperBound) range.
 */
export function getRandomNatural(lowerBound: number,
                                 upperBound: number): number {
  return Math.floor(getRandomNumber(lowerBound, upperBound));
}

/**
 * Gets a random real number given a range.
 * @param lowerBound The lowest number possible.
 * @param upperBound The greatest number possible.
 * @return A random real number in [lowerBound, upperBound) range.
 */
export function getRandomNumber(lowerBound: number,
                                upperBound: number): number {
  return Math.floor(Math.random() * (upperBound - lowerBound + 1))
    + lowerBound;
}
