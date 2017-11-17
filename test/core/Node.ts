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

import {expect} from 'chai';
import Node from '../../src/core/Node';

describe('core::Node', () => {
    it('Build', () => {
        const n = new Node('1*-1.4/(3+(2))+(1+1)+(sin(pi))+1-1');
        expect(1.72).to.equals(n.numberValue);
    });

    it('Addition', () => {
        let n = new Node(1);
        n = n.add(-2);
        expect(n.getNumberValue()).to.equals(-1);
        expect(n.add(n.negate()).numberValue).to.equals(0);
    });

    it('Subtraction', () => {
        let n = new Node(1);
        n = n.subtract(-2);
        expect(n.numberValue).to.equals(3);
    });

    it('Multiplication', () => {
        let n = new Node(1);
        n = n.multiply(-2);
        expect(n.numberValue).to.equals(-2);
    });

    it('Division', () => {
        let n = new Node(1);
        n = n.divide('-1/4');
        expect(n.numberValue).to.equals(-4);
    });
});
