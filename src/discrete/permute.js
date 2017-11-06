"use strict";
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
exports.__esModule = true;
var integers_1 = require("./integers");
/**
 * Permutes an array arr.length! times or perms times.
 * @param arr The array to permute.
 * @param perms The maximum number of times to permute.
 * @returns An array with perms permutations of arr.
 */
function permute(arr, perms) {
    // TODO
    return [];
}
exports.permute = permute;
/**
 * Permutes an array arr.length! times or perms times. This algorithm tries
 * to permute the array given randomly in order to get more diversity on NP
 * problem solutions.
 * @param arr The array to permute.
 * @param perms The maximum number of times to permute.
 * @returns An array with perms permutations of arr.
 */
function randPermute(arr, perms) {
    var permutations = [];
    while (permutations.length < perms) {
        var i = 0, j = 0;
        var perm = arr.slice();
        while (i === j && arr.length !== 1) {
            i = integers_1.randInt(0, arr.length);
            j = integers_1.randInt(0, arr.length);
        }
        perm[i] = arr[j];
        perm[j] = arr[i];
        permutations.push(perm);
    }
    return permutations;
}
exports.randPermute = randPermute;
/**
 * Generates a random permutation with numbers from 0 to n - 1.
 * @param n The size of the array.
 */
function randPermutation(n) {
    var perm = [];
    for (var i = 0; i < n; i++)
        perm.push(i);
    n = n * n;
    for (var i = 0; i < n; i++) {
        var a = integers_1.randInt(0, perm.length), b = integers_1.randInt(0, perm.length);
        var aux = perm[a];
        perm[a] = perm[b];
        perm[b] = aux;
    }
    return perm;
}
exports.randPermutation = randPermutation;
