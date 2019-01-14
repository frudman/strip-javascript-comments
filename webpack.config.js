'use strict'

// to run minimizer: npm run build
// then, to run tests: npm run test

// "maintained" minimizer for webpack (from https://github.com/terser-js/terser)
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './strip-comments.js',
    output: { path: __dirname, filename: './strip-comments.min.js', libraryTarget: 'commonjs' },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                // from: https://github.com/terser-js/terser#minify-options-structure
                // and: https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                // - basic settings below (many more available)

                ecma: 5, 
                mangle: true, // Note `mangle.properties` is `false` by default.

                output: {
                    comments: false, // https://github.com/webpack-contrib/terser-webpack-plugin#remove-comments
                },

                ie8: false,
                keep_classnames: undefined,
                keep_fnames: false,
                safari10: false,
            },
        })],
    }
}