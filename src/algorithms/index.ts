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

export * from './quickSort';
export * from './mergeSort';

/**
 * A log will be a register where to store information about some steps in
 * algorithms execution. If there is the need to keep a record about the
 * steps in some algorithms then Log may be used to store it.
 */
export interface Log {
  name: string;
  info?: any;
  htmlRepresentation?: HTMLElement;
  stringRepresentation?: string;
  representation?: any;
}

export type Logger = Log[];
