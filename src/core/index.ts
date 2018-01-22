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

import Node from './Node';

/**
 * Creates and expression from a given one, then returns the equivalent for
 * that expression as a math object.
 * @param exp The expression to be evaluated.
 * @return A Node object containing the value of the expression.
 */
export function evaluate(exp: string): Node {
  return new Node(exp);
}

export {
  Node as Expression
};
