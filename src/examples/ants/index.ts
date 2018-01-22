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
 *
 * This module example describes an implementation of an Ant Colony
 * Optimization for the Traveling Salesman Problem using the tools provided
 * by maths.ts.
 *
 * Note: The main point of this example is to illustrate the behaviour of
 * the algorithm so it doesn't make use of many functions on maths.ts.
 */

import * as fs from 'fs';
import {AntColony} from './ant';

const progress: any = require('cli-progress');
const filename = process.env.FILE || './assets/tsp/1.tsp';
const problemName = filename.split('/').pop();
// Best solution for 4.tsp: 0 1 2 3 9 8 7 6 5 4
const iterations = [50];
const alphas = [2, 2.1];
const betas = [2, 2.1];
const aFactors = [0.4, 0.5];
const eRates = [0.9, 0.7, 0.5];
const ITS = 30; // Number of iterations per parameter combination
const combinations = iterations.length * alphas.length * betas.length *
  aFactors.length * eRates.length * ITS; // Total number of combinations

fs.readFile(filename, 'utf8', (err, data: string) => {
  const towns = data.split(/\r?\n/).map(p => {
    const xy = p.split(' ');
    return {
      x: Number(xy[1]),
      y: Number(xy[2])
    };
  });

  const colony = new AntColony(towns);
  optimize().then(report => {
    let csvData = '';
    report.forEach(r => csvData += r.join(',') + '\n');
    const reportFile = problemName + '.AntsReport.csv';
    fs.writeFile(reportFile, csvData, er => {
      if (er) {
        console.error('Something occurred while saving the report.');
      } else {
        console.log('Report saved at ' + reportFile);
      }
    });
  });


  async function optimize() {
    const report: any[][] = [['Params', 'hMin', 'hMax', 'hAvg', 'tAvg']];
    let k: number;
    const bar: any = new progress.Bar({}, progress.Presets.shades_classic);

    bar.start(combinations, k = 0);
    for (const it of iterations) {
      for (const a of alphas) {
        for (const b of betas) {
          for (const af of aFactors) {
            for (const er of eRates) {
              let min = Infinity;
              let max = -Infinity;
              let avg = 0;
              let tAvg = 0;
              for (let i = 0; i < ITS; i++) {
// Params: (it, af, er, alpha, beta);
                const time = +new Date();
                const sol = await colony.optimize(it, af, er, a, b);
                tAvg += +new Date() - time;
                avg += sol.distance;
                min = min > sol.distance ? sol.distance : min;
                max = max < sol.distance ? sol.distance : max;
                bar.update(++k);
              }

              tAvg /= ITS;
              avg /= ITS;
              report.push([
                `it:${it}|a:${a}|b:${b}|af:${af}|er:${er}`,
                min.toFixed(2),
                max.toFixed(2),
                avg.toFixed(2),
                tAvg.toFixed(0)
              ]);
            }
          }
        }
      }
    }

    bar.stop();

    return report;
  }
});
