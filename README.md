# maths.ts
[![Version](https://img.shields.io/npm/v/maths.ts.svg)](https://www.npmjs.com/package/maths.ts)
[![Downloads](https://img.shields.io/npm/dm/maths.ts.svg)](https://www.npmjs.com/package/maths.ts)
[![Build Status](https://img.shields.io/travis/IpiVasquez/maths.ts.svg)](https://travis-ci.org/IpiVasquez/maths.ts)
![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)
[![License](https://img.shields.io/github/license/IpiVasquez/mathts.ts.svg)](https://github.com/IpiVasquez/maths.ts/blob/master/LICENSE)

## A very extensive library for doing maths!
Maths.ts is a very extensive library for doing maths in TypeScript, JavaScript and Node.js. It is written in TypeScript looking for a strong typing. Math.ts features an expression parser and many other math functions to work comfortably with any data type coming.

Moreover, maths.ts is not limited to just some math functions. Maths.ts includes support for some well known algorithms such as graph's handling algorithms, some linear algebra approximation methods and algorithms, among others.

## Features
- Support in any kind of number, graphs, matrices.
- Support for arithmetic operations, algebra, analysis(pending), combinatorics(pending), geometry and topology(pending), probability and statistics(pending), computational sciences(pending), etc.
- Some known algorithms: e.g. simplex algorithm, merge, bfs, etc.
- Open source.

## Installation
Maths.ts is available as the `maths.ts` package on npm.

    npm install maths.ts
 
At this time it is not available on a CDN. So in order to use it in browser it is necessary to download from this repository at: `./bundle/maths.js` or `./bundle/maths.min.js`.

## Usage
We are working on a website to upload several examples but at this time we only have a few. Here is the first one to get you started:

    var math = require('maths.ts');
    
    a = math.eval('2*3'); // math.ts obj {6}
    a.multiply(4); // math.ts obj {24}
