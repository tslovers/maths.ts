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

import {simulatedAnnealing} from '../../metaheuristics/simulatedAnnealing';
import {table} from 'table';
import {generateLOP} from './lop';
import * as fs from 'fs';

const filename = process.env.FILE || './assets/testMatrix';
const problemName = filename.split('/').pop();

// Number of repetitions for each permutation of parameters
const reps = 30;
// Possible parameters
const temperature = [
  {
    description: 't0:100|tf:0|d(t)=t-0.1',
    tf: 0,
    t0: 100,
    decrease: (t: number): number => t - 0.1
  },
  {
    description: 't0:100|tf:1|d(t)=t*0.99',
    tf: 1,
    t0: 100,
    decrease: (t: number): number => t * 0.99
  },
  {
    description: 't0:200|tf:0|d(t)=t-0.1',
    tf: 0,
    t0: 200,
    decrease: (t: number): number => t - 0.1
  }
];
const neighborhoodSize = [5, 15, 25];
const neighborhoodDiversity = [0.05, 0.1, 0.15];

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
  temperature.forEach(t => {
    neighborhoodDiversity.forEach(nv => {
      neighborhoodSize.forEach(ns => {
        report.push([
          t.description + '|nv:' + nv + '|ns:' + ns,
          Infinity,
          0,
          0,
          Infinity,
          0,
          0
        ]);
// Checks the iteration number
        const it = report.length - 1;
        for (let i = 0; i < reps; i++) {
// To check time later
          let time = +new Date();
// Generate solution
          const s = simulatedAnnealing(lop, ns, nv, t.t0, t.tf, t.decrease);
          const h = lop.solutionValue(s);
// Time spent
          time = +new Date() - time;

          report[it][6] += h;
          report[it][3] += time;

          if (report[it][1] > time) {
            report[it][1] = time;
          }
          if (report[it][2] < time) {
            report[it][2] = time;
          }
          if (report[it][4] > h) {
            report[it][4] = h;
          }
          if (report[it][5] < h) {
            report[it][5] = h;
          }
        }
        report[it][6] = Math.round(report[it][6] / reps);
        report[it][3] = Math.round(report[it][3] / reps);
      });
    });
  });
  gTime = +new Date() - gTime;
  console.log('Total time: ' + gTime);
  console.log('Total iterations: ' +
    (temperature.length * neighborhoodDiversity.length *
      neighborhoodSize.length * reps) + ' (' + reps + ' for each ' +
    'parameter combination)');
  console.log(table(report));

  let csvData = '';
  report.forEach(r => csvData += r.join(',') + '\n');
  const reportFile = problemName + '.SAReport.csv';
  fs.writeFile(reportFile, csvData, er => {
    if (er) {
      console.error('Something occurred while saving the report.');
    } else {
      console.log('Report saved at ' + reportFile);
    }
  });
});
