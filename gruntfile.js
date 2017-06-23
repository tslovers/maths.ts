var tsconfig = require('./tsconfig.json');

module.exports = function (grunt) {
    "use strict";

    //noinspection JSUnresolvedFunction
    grunt.initConfig({
        ts: {
            lib: {
                files: [{
                    src: ["./src/\*\*/\*.ts"],
                    dest: tsconfig.outDir
                }],
                options: {
                    target: tsconfig.compilerOptions.target,
                    sourceMap: tsconfig.compilerOptions.sourceMap,
                    declaration: tsconfig.compilerOptions.declaration,
                    rootDir: tsconfig.rootDir
                }
            }
        },
        watch: {
            ts: {
                files: ["src/\*\*/\*.ts"],
                tasks: ["ts"]
            }
        },
        exec: {
            webpack: "./node_modules/.bin/webpack",
            minify: "./node_modules/.bin/minify bundle/ -c"
        }
    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-exec");

    grunt.registerTask("default", [
        "ts",
        "exec"
    ]);

};
