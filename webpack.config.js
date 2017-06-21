module.exports = {
    entry: './lib/maths.js',
    devtool: 'source-map',
    output: {
        path: __dirname,
        filename: 'bundle/maths.js',
        library: 'mathsts' // maths.ts or just maths?
    }
};