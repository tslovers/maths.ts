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

import {table} from 'table';
import * as NP from './NP';
import * as fs from 'fs';
import {harmonicSearch} from './metaheuristics/harmonySearch';

let filename = process.env.FILE || './assets/testMatrix';
let problemName = filename.split('/').pop();

// Number of repetitions for each permutation of parameters
const reps: number = 30;
// Possible parameters
let iterations = [500, 1000, 1500];
let hmConsideringRate = [0.6, 0.7, 0.8];
let harmonicMemorySize = [10, 30, 50];
let neighborhoodDiversity = [0.05, 0.1, 0.15];

fs.readFile(filename, 'utf8', (err, data: string) => {
    if (err) {
        console.error('An error occurred', err);
        return;
    }

    let formattedData = data.split(/[\n ]/);
    let n = Number(formattedData.shift());
    let dataset = [];
    for (let i = 0; i < n; i++) {
        dataset.push([]);
        for (let j = 0; j < n; j++)
            dataset[i].push(Number(formattedData.shift()));
    }

    console.log('Problem: ' + problemName);
    let lop = NP.generateLOP(dataset);
    let report: any[][] = [
        ['Param', 'tMin', 'tMax', 'tAvg', 'hMin', 'hMax', 'hAvg']
    ];
    let gTime = +new Date();
    neighborhoodDiversity.forEach(nv => {
        hmConsideringRate.forEach(hmcr => {
            harmonicMemorySize.forEach(hms => {
                report.push([
                    'nv:' + nv + '|hmcr:' + hmcr + '|hms:' + hms,
                    Infinity,
                    0,
                    0,
                    Infinity,
                    0,
                    0
                ]);
                // Checks the iteration number
                let it = report.length - 1;
                for (let i = 0; i < reps; i++) {
                    // To check time later
                    let time = +new Date();
                    // Generate solution
                    let s = harmonicSearch(lop, hms, hmcr, nv, 1000);
                    let h = lop.solutionValue(s);
                    // Time spent
                    time = +new Date() - time;

                    report[it][6] += h;
                    report[it][3] += time;

                    if (report[it][1] > time)
                        report[it][1] = time;
                    if (report[it][2] < time)
                        report[it][2] = time;
                    if (report[it][4] > h)
                        report[it][4] = h;
                    if (report[it][5] < h)
                        report[it][5] = h;
                }
                report[it][6] = Math.round(report[it][6] / reps);
                report[it][3] = Math.round(report[it][3] / reps);
            });
        });
    });
    gTime = +new Date() - gTime;
    console.log('Total time: ' + gTime);
    console.log(table(report));

    let csvData = '';
    report.forEach(r => csvData += r.join(',') + '\n');
    let reportFile = problemName + '.HSReport.csv';
    fs.writeFile(reportFile, csvData, err => {
        if (err)
            console.error('Something occurred while saving the report.');
        else
            console.log('Report saved at ' + reportFile);
    });
});