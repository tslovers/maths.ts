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

import * as metaheuristics from './metaheuristics';
import * as structures from './structures';
import * as arithmetic from './arithmetic';
import * as discrete from './discrete';
import * as graph from './graph';
import * as NP from './NP';
// import * as plotter from './plotter';
// import * as util from './utils';

export {
    arithmetic,
    discrete,
    graph,
    metaheuristics,
    NP,
    // plotter,
    structures
    // util
};

export * from './algorithms';
export * from './core';