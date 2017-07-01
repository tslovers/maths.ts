[![Version](https://img.shields.io/npm/v/maths.ts.svg)](https://www.npmjs.com/package/maths.ts)
[![Downloads](https://img.shields.io/npm/dm/maths.ts.svg)](https://www.npmjs.com/package/maths.ts)
[![Build Status](https://img.shields.io/travis/IpiVasquez/maths.ts.svg)](https://travis-ci.org/IpiVasquez/maths.ts)
![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)
[![License](https://img.shields.io/github/license/IpiVasquez/maths.ts.svg)](https://github.com/IpiVasquez/maths.ts/blob/master/LICENSE)

# maths.ts

## A very extensive library for doing maths!
Maths.ts is a very extensive library for doing maths in TypeScript, JavaScript and Node.js. It is written in TypeScript looking for a strong typing. Math.ts features an expression parser and many other math functions to work comfortably with any data type coming.

Moreover, maths.ts is not limited to just some math functions. Maths.ts includes support for some well known algorithms such as graph's handling algorithms, some linear algebra approximation methods and algorithms, among others.

## Features
- Support in any kind of number, graphs, matrices.
- Support for arithmetic operations, algebra, analysis(pending), combinatorics(pending), geometry and topology(pending), probability and statistics(pending), computational sciences(pending), etc.
- Some known algorithms: e.g. simplex algorithm, merge, bfs, etc.
- Open source.

## Installing
Maths.ts is available as the `maths.ts` package on npm.

    npm install maths.ts

## Usage
We are working on a website to upload several examples but at this time we only have a few. Here is the first one to get you started:

    var math = require('maths.ts');
    
    a = math.eval('2*3'); // maths.ts obj {6}
    a.multiply(4); // maths.ts obj {24}
    
Please use brackets to avoid ambiguities like 2^3^4. 2^3^4 may be interpreted as 2^(3^4) as well as (2^3)^4, throwing two different results.

## Browser support
At this time it is not available on a CDN. So in order to use it in browser it is necessary to compile it. To do so you'll need to follow the next instructions:
  
      git clone https://github.com/IpiVasquez/maths.ts.git
      cd maths.ts
      npm install
      npm run grunt

These lines will create a file on maths.ts/bundle/ which will contain maths.js and maths.min.js, ready to use in your browser.

## Documentation
* [Quick tutorial](https://github.com/IpiVasquez/maths.ts/wiki)
* [Wiki](https://github.com/IpiVasquez/maths.ts/wiki)

## Contributing
There are many ways to [contribute](https://github.com/IpiVasquez/maths/.tsblob/master/CONTRIBUTING.md) to maths.ts.

* Submit bugs and help us verify fixes as they are checked in.
* Review source code changes.
* Suggest/implement new features.
* Recommend this library.
* Contribute bugs fixes.

This project has adopted the [Contributor Covenant Code of Conduct](https://github.com/IpiVasquez/maths.ts/.tsblob/master/CODE_OF_CONDUCT).

* * *