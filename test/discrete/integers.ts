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
import {randInt, factorial} from '../../src/discrete/integers';
import {expect} from 'chai';

const SLACK = 0.0001;

describe('discrete::integers', () => {
    it('Range random int', () => {
        let j = 0, i = 500;
        expect(randInt(j, i) >= j).to.equals(true);
        expect(randInt(j, i) < i).to.equals(true);
        j = 500;
        i = 1000;
        expect(randInt(j, i) >= j).to.equals(true);
        expect(randInt(j, i) < i).to.equals(true);
        j = 1;
        i = 2;
        expect(randInt(j, i) >= j).to.equals(true);
        expect(randInt(j, i) < i).to.equals(true);
        j = 500;
        i = 1000000;
        expect(randInt(j, i) >= j).to.equals(true);
        expect(randInt(j, i) < i).to.equals(true);
    });

    it('Factorial number', () => {
        let n = randInt(0, 10);
        let m = randInt(0, 10);
        if (m < n) {
            const aux = n;
            n = m;
            m = n;
        }
        let fact = 1;
        for (let i = n + 1; i <= m; i++) {
            fact *= i;
        }

        expect(factorial(m) / factorial(n)).to.equals(fact);
    });
});
