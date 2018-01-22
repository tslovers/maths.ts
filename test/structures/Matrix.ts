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

import Matrix from '../../src/structures/Matrix';
import {expect} from 'chai';

describe('structures::Matrix', () => {
    let matrix2x2 = new Matrix();
    let matrix3x3 = new Matrix();
    let matrix4x4 = new Matrix();

    it('Build', () => {
        matrix2x2 = new Matrix([
            [3, 2],
            [1, 1]
        ]); // Det = 1

        matrix3x3 = new Matrix([
            [-2, 2, -3],
            [-1, 1, 3],
            [2, 0, -1]
        ]); // Det = 18

        matrix4x4 = new Matrix([
            [3, 2, 0, 1],
            [4, 0, 1, 2],
            [3, 0, 2, 1],
            [9, 2, 3, 1]
        ]); // Det = 24
    });

    it('Determinant', () => {
        expect(matrix2x2.determinant.numberValue).to.equals(1);
        expect(matrix3x3.determinant.numberValue).to.equals(18);
        expect(matrix4x4.determinant.numberValue).to.equals(24);
    });

    it('Transpose', () => {
        expect(matrix4x4.transpose.determinant.numberValue)
            .to.equals(matrix4x4.determinant.numberValue);
    });

    it('Inverse', () => {
        expect(matrix4x4.inverse.determinant.numberValue)
            .to.equals(1 / matrix4x4.determinant.numberValue);
        expect(matrix3x3.inverse.determinant.numberValue)
            .to.equals(1 / matrix3x3.determinant.numberValue);
        expect(matrix2x2.inverse.determinant.numberValue)
            .to.equals(1 / matrix2x2.determinant.numberValue);
    });

    it('Multiplication', () => {
        expect(matrix4x4.multiply(matrix4x4.inverse).determinant.numberValue)
            .to.equals(1);
        expect(matrix4x4.multiply(matrix4x4).determinant.numberValue)
            .to.equals(24 * 24);
    });
});
