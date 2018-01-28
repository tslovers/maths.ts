[![Build Status][travis-image]][travis-url]
[![Version][npm-image]][npm-url]
[![Downloads][npm-downloads-image]][npm-url]
![Maintenance][maintain-image]
[![License][license-image]][license-url]
# maths.ts

## A very extensive library for doing maths!
Maths.ts is a very extensive library for doing maths in TypeScript,
JavaScript and Node.js. It is written in TypeScript looking for a strong
typing. Math.ts features an expression parser and many other math functions
to work comfortably with any data type coming.

Moreover, maths.ts is not limited to just some math functions. Maths.ts
includes support for some well known algorithms such as graph's handling
algorithms, some linear algebra approximation methods and algorithms, among
others.

## Features
* Support for real numbers and high accuracy operations between them.
* Support for matrices and vectors and operations between them as well as their
properties (determinant, transpose, etc.).
* Support for arithmetic properties of some numbers (greatest common divisor,
least common multiple, factors of a number).
* Embedded algorithms implemented.
  * Merge sort.
  * Quick sort.
  * Sieve of Eratosthenes.
  * Graph search algorithms (BFS, DFS, a-star, greedy search, etc.).
* Embedded data structures.
  * Bit set.
  * Matrix.
  * Graph.
* Open source.

## Upcoming features
* Support for algebraic expression and operations with them (derive, integrate,
calculating the value of a variable, etc.).
* Support for combinatorics, geometry and topology, probability and statistics,
and many other computer science and mathematics related.
* Symbolical computing.
* Embedded plotter for functions.
* Embedded algorithms.
  * Simplex algorithm.
  * MODI algorithm for transportation theory problems.

## Installing
Maths.ts is available as the `maths.ts` package on npm.
```bash
npm install maths.ts
```

## Usage
We are working on a website to upload several examples but at this time we only
have a few. Here is the first one to get you started:

```js
let math = require('maths.ts');
    
a = math.evaluate('2*3'); // maths.ts obj {6}
a.multiply(4); // maths.ts obj {24}
```
    
Please use brackets to avoid ambiguities like 2^3^4. 2^3^4 may be interpreted
as 2^(3^4) as well as (2^3)^4, throwing two different results.

## Browser support
At this time it is not available on a CDN. So in order to use it in browser it
is necessary to compile it. To do so you'll need to follow the next
instructions:

```bash
git clone https://github.com/IpiVasquez/maths.ts.git
cd maths.ts
npm install
npm run gulp
```

These lines will create a file on maths.ts/bundle/ which will contain maths.js
and maths.min.js, ready to use in your browser.

## Documentation
* [Quick tutorial](https://github.com/IpiVasquez/maths.ts/wiki)
* [Wiki](https://github.com/IpiVasquez/maths.ts/wiki)

## Contributing
There are many ways to [contribute](https://github.com/IpiVasquez/maths.ts/blob/master/CONTRIBUTING.md) to maths.ts.

* Submit bugs and help us verify fixes as they are checked in.
* Review source code changes.
* Suggest/implement new features.
* Recommend this library.
* Contribute bugs fixes.

This project has adopted the [Contributor Covenant Code of Conduct](https://github.com/IpiVasquez/maths.ts/blob/master/CODE_OF_CONDUCT.md).

[npm-image]: https://img.shields.io/npm/v/maths.ts.svg
[npm-downloads-image]: https://img.shields.io/npm/dm/maths.ts.svg
[npm-url]: https://www.npmjs.com/package/maths.ts

[travis-image]: https://img.shields.io/travis/tslovers/maths.ts.svg
[travis-url]: https://travis-ci.org/tslovers/maths.ts

[maintain-image]: https://img.shields.io/maintenance/yes/2018.svg

[license-image]: https://img.shields.io/github/license/tslovers/maths.ts.svg
[license-url]: https://github.com/tslovers/maths.ts/blob/master/LICENSE
