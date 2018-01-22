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
import {InputError} from './Error';

/**
 * Defines the operators available.
 */
export let operators: any = {
  '+': {
    priority: 1,
    params: 2,
    fn: (nodeA: Node, nodeB: Node, scope: any) => {
      const a = nodeA.getNumberValue(scope),
        b = nodeB.getNumberValue(scope);
      if (a !== undefined && b !== undefined) {
        return a + b;
      }
      return undefined;
    }
  },
  '-': {
    priority: 1,
    params: 2,
    fn: (nodeA: Node, nodeB: Node, scope: any) => {
      const a = nodeA.getNumberValue(scope),
        b = nodeB.getNumberValue(scope);
      if (a !== undefined && b !== undefined) {
        return a - b;
      }
      return undefined;
    }
  },
  '*': {
    priority: 2,
    params: 2,
    fn: (nodeA: Node, nodeB: Node, scope: any) => {
      const a = nodeA.getNumberValue(scope),
        b = nodeB.getNumberValue(scope);
      if (a !== undefined && b !== undefined) {
        return a * b;
      }
      return undefined;
    }
  },
  '/': {
    priority: 2,
    params: 2,
    fn: (nodeA: Node, nodeB: Node, scope: any) => {
      const a = nodeA.getNumberValue(scope),
        b = nodeB.getNumberValue(scope);
      if (a !== undefined && b !== undefined) {
        return a / b;
      }
      return undefined;
    }
  },
  '^': {
    priority: 3,
    params: 2,
    fn: (nodeA: Node, nodeB: Node, scope: any) => {
      const a = nodeA.getNumberValue(scope),
        b = nodeB.getNumberValue(scope);
      if (a !== undefined && b !== undefined) {
        return Math.pow(a, b);
      }
      return undefined;
    }
  },
  '!': {
    priority: 4,
    params: 1,
    fn: (node: Node, scope: any) => {
      let aux;
      if ((aux = node.getNumberValue(scope)) !== undefined) {
        return fact(aux);
      }
      return aux;

      function fact(i: number): number {
        if (i < 0 || Math.floor(i) === i) {
          throw new InputError(
            'At this moment we are only capable to calculate ' +
            'positive integers[0, inf).'
          ); // TODO: factorial function (Gamma)
        }
        if (i < 2) {
          return 1;
        }
        return i * fact(i - 1);
      }
    }
  }
};

/**
 * Defines the functions available.
 */
export let functions: any = {
  sin: {
    fn: (node: Node, scope?: any) => {
      let aux: number;
      if ((aux = node.getNumberValue(scope)) !== undefined) {
        return Math.sin(aux);
      }
      return aux;
    }
  },
  cos: {
    fn: (node: Node, scope?: any) => {
      let aux: number;
      if ((aux = node.getNumberValue(scope)) !== undefined) {
        return Math.cos(aux);
      }
      return aux;
    }
  },
  tan: {
    fn: (node: Node, scope?: any) => {
      let aux: number;
      if ((aux = node.getNumberValue(scope)) !== undefined) {
        return Math.tan(aux);
      }
      return aux;
    }
  },
  asin: {
    fn: (node: Node, scope?: any) => {
      let aux: number;
      if ((aux = node.getNumberValue(scope)) !== undefined) {
        return Math.asin(aux);
      }
      return aux;
    }
  },
  acos: {
    fn: (node: Node, scope?: any) => {
      let aux: number;
      if ((aux = node.getNumberValue(scope)) !== undefined) {
        return Math.acos(aux);
      }
      return aux;
    }
  },
  atan: {
    fn: (node: Node, scope?: any) => {
      let aux: number;
      if ((aux = node.getNumberValue(scope)) !== undefined) {
        return Math.atan(aux);
      }
      return aux;
    }
  },
  log: {
    fn: (node: Node, scope?: any) => {
      let aux: number;
      if ((aux = node.getNumberValue(scope)) !== undefined) {
        return Math.log(aux);
      }
      return aux;
    }
  }
};

/**
 * Defines the constants available.
 */
export let constants: any = {
  e: Math.E,
  pi: Math.PI,
  PI: undefined,
  E: undefined
};
constants.E = constants.e;
constants.PI = constants.pi;
