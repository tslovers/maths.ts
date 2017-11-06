# Instructions for Logging Issues
## 1. Read the FAQ
We are still working at a FAQ. Meanwhile you can skip this step due to the lack of FAQ.
## 2. Search for duplicates
[Search the existing issues](https://github.com/IpiVasquez/maths.ts/issues) before logging a new one.
## 3. Did you find a bug?
If the bug has not been reported yet (previous step) please submit it to the issues page.
## 4. Do you have a suggestion?
Maths.ts is a still growing so suggestions on new features are very welcome. However, please make sure the suggestion has not already been suggested and search it first (step 2).

We recommend you to inform some useful things to consider when you are making a suggestion. This consideration would help us when we are reviewing your suggestion:
* A description of the problem you're trying to solve.
* An overview of the suggested solution.
* Code examples of how the suggestion would work in various places, showing e.g. "This would be an error, this would not".
* A precedent of how this feature work in other languages, e.g. in octave. Obviously if it has been implemented.

# Instructions for Contributing Code
## Contributing bug fixes
Before sending pull request we encourage you to open an issue about the bug you are trying to solve. This would make us easier to review your code and be familiar with the intention of your pull request.

## Contributing with new features
Before sending pull request we encourage you to open an issue about the feature you want to implement. This would make us easier to review your code and be familiar with the intention of your pull request.

## Housekeeping
Your pull request should:
* Include a description of what your change intends to do.
* In the case of a new feature, it is necessary create a new test.
* Have clear commit messages
* Follow the code conventions described in [Coding guidelines](https://github.com/IpiVasquez/maths.ts/blob/master/CODING_GUIDELINE.md)

## Running the tests
To run all test, just run:
    
    npm test

## Adding a test
The tools for testing that we use are mocha and chai. Tests are included in the test directory and they are organized according to the module they test. Please try to keep the same logic on your new test.