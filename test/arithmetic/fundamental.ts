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
import {getRandomNatural} from '../../src/utils/index';
import {gcd, lcm} from '../../src/arithmetic';

describe('Lattice theory - Laws for GCD & LCM', () => {
    const a = getRandomNatural(2, 1000);
    const b = getRandomNatural(2, 1000);
    const c = getRandomNatural(2, 1000);

    it('Commutative law', () => {
        expect(lcm(a, b)).to.equals(lcm(a, b));
        expect(gcd(a, b)).to.equals(gcd(a, b));
    });

    it('Associative law', () => {
        expect(lcm(a, lcm(b, c))).to.equals(lcm(lcm(a, b), c));
        expect(gcd(a, gcd(b, c))).to.equals(gcd(gcd(a, b), c));
    });

    it('Absorption law', () => {
        expect(lcm(a, gcd(a, b))).to.equals(a);
        expect(gcd(a, lcm(a, b))).to.equals(a);
    });

    it('Idempotent law', () => {
        expect(lcm(a, a)).to.equals(a);
        expect(gcd(a, a)).to.equals(a);
    });

    it('Distributive law', () => {
        expect(lcm(a, gcd(b, c))).to.equals(gcd(lcm(a, b), lcm(a, c)));
        expect(gcd(a, lcm(b, c))).to.equals(lcm(gcd(a, b), gcd(a, c)));
    });
});
