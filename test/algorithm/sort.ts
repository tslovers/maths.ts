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

import * as algorithms from '../../src/algorithms';
import * as comparisons from '../../src/utils/comparisons';
import {expect} from 'chai';

describe('algorithms::mergeSort', () => {
    const array = [10, 5, 17, 18, 68, 12, 0, -4, 47];

    it('Odd size array, ascending', () => {
        expect(comparisons.isAscendingArray(
            algorithms.mergeSort(array, comparisons.ascending)
        )).to.equals(true);
        expect(comparisons.isAscendingArray(
            algorithms.mergeSort(array, comparisons.ascending)
        )).to.equals(true);
    });

    it('Odd size array, descending', () => {
        expect(comparisons.isDescendingArray(
            algorithms.mergeSort(array, comparisons.descending)
        )).to.equals(true);
        expect(comparisons.isDescendingArray(
            algorithms.mergeSort(array, comparisons.descending)
        )).to.equals(true);
    });

    array.push(1);
    it('Pair size array, ascending', () => {
        expect(comparisons.isAscendingArray(
            algorithms.mergeSort(array, comparisons.ascending)
        )).to.equals(true);
        expect(comparisons.isAscendingArray(
            algorithms.mergeSort(array, comparisons.ascending)
        )).to.equals(true);
    });

    it('Pair size array, descending', () => {
        expect(comparisons.isDescendingArray(
            algorithms.mergeSort(array, comparisons.descending)
        )).to.equals(true);
        expect(comparisons.isDescendingArray(
            algorithms.mergeSort(array, comparisons.descending)
        )).to.equals(true);
    });
});

describe('algorithms::quickSort', () => {
    const array = [10, 5, 17, 18, 68, 12, 0, -4, 47];
    it('Odd size array, ascending', () => {
        expect(comparisons.isAscendingArray(
            algorithms.quickSort(array, comparisons.ascending)
        )).to.equals(true);
    });

    it('Odd size array, descending', () => {
        expect(comparisons.isDescendingArray(
            algorithms.quickSort(array, comparisons.descending)
        )).to.equals(true);
    });

    array.push(1);
    it('Pair size array, ascending', () => {
        expect(comparisons.isAscendingArray(
            algorithms.quickSort(array, comparisons.ascending)
        )).to.equals(true);
    });

    it('Pair size array, descending', () => {
        expect(comparisons.isDescendingArray(
            algorithms.quickSort(array, comparisons.descending)
        )).to.equals(true);
    });
});
