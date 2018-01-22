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

import {generateLOP} from './lop';
import * as fs from 'fs';
import {geneticAlgorithm} from '../../metaheuristics/geneticAlgorithm';

const filename = process.env.FILE || './assets/testMatrix';
const problemName = filename.split('/').pop();

fs.readFile(filename, 'utf8', (err, data: string) => {
  if (err) {
    console.error('An error occurred', err);
    return;
  }

  const formattedData = data.split(/[\n ]/);
  const n = Number(formattedData.shift());
  const dataset = [];
  for (let i = 0; i < n; i++) {
    dataset.push([]);
    for (let j = 0; j < n; j++) {
      dataset[i].push(Number(formattedData.shift()));
    }
  }

  console.log('Problem: ' + problemName);
  const lop = generateLOP(dataset);
  const report: any[][] = [
    ['Param', 'tMin', 'tMax', 'tAvg', 'hMin', 'hMax', 'hAvg']
  ];
  let gTime = +new Date();
  for (let i = 0; i < 30; i++) {
    const sol = geneticAlgorithm(lop, 30, 10000, 0.5, 0.1, 0.9, 0.5);
    console.log(lop.solutionValue(sol));
  }
  gTime = +new Date() - gTime;
  console.log('Total time: ' + gTime);
});
