# maths.ts
[![Version](https://img.shields.io/npm/v/maths.ts.svg)](https://www.npmjs.com/package/maths.ts)
[![Downloads](https://img.shields.io/npm/dm/maths.ts.svg)](https://www.npmjs.com/package/maths.ts)
![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)
[![License](https://img.shields.io/github/license/IpiVasquez/maths.ts.svg)](https://github.com/IpiVasquez/maths.ts/blob/master/LICENSE)

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

## Browser support 
At this time it is not available on a CDN. So in order to use it in browser it is necessary to compile it.
 To do so you'll need to follow the next instructions:
  
      git clone https://github.com/IpiVasquez/maths.ts.git
      cd maths.ts
      npm install
      npm run grunt

These lines will create a file on maths.ts/bundle/ which will
contain maths.js and maths.min.js, ready to use in your browser.

## Usage
We are working on a website to upload several examples but at this time we only have a few. Here is the first one to get you started:

    var math = require('maths.ts');
    
    a = math.eval('2*3'); // maths.ts obj {6}
    a.multiply(4); // maths.ts obj {24}
    
Please use brackets to avoid ambiguities like 2^3^4. 2^3^4 may be
interpreted as 2^(3^4) as well as (2^3)^4, throwing two different results.
    
## Documentation