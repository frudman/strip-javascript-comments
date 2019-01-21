
// - to build libs: npm run build
// - to run tests: npm run test
// - don't forget to:
//  - update package.json[.version]
//  - then: npm publish

// webpack strategy inspired from: https://tech.trivago.com/2015/12/17/export-multiple-javascript-module-formats/

// todo: re-implement using https://www.npmjs.com/package/parallel-webpack
//       - same as below but done in parallel (and .variant() function already implemented)

const { genCombinations } = require('tidbits');

// "maintained" minimizer for webpack (from https://github.com/terser-js/terser)
const TerserPlugin = require('terser-webpack-plugin');

const minimizerConfig = ecmaVersion => new TerserPlugin({
    terserOptions: {
        // from: https://github.com/terser-js/terser#minify-options-structure
        // and: https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        // - basic settings below (many more available)

        ecma: ecmaVersion,
        mangle: true, // Note `mangle.properties` is `false` by default.

        output: {
            comments: false, // https://github.com/webpack-contrib/terser-webpack-plugin#remove-comments
        },

        ie8: false,
        keep_classnames: undefined,
        keep_fnames: false,
        safari10: false,
    },
});

const webpackConfig = opt => ({
    mode: 'production',
    entry: './index.mjs',
    output: { 
        path: __dirname, 
        filename: `lib/${opt.target.lib}/es${opt.ecma}/index${opt.minimize?'.min':''}.js`,
        libraryTarget: opt.target.name,

        // // VERY IMPORTANT: globalObject as per below else 'window' will be used and this fails when
        // // trying to import this module in a node app (e.g. another webpack config file)
        // // - as per: https://github.com/webpack/webpack/issues/6525#issuecomment-417580843
        // // - also: https://github.com/webpack/webpack/issues/6522#issuecomment-366708234
        // globalObject: `typeof self !== 'undefined' ? self : this`, // replaces default of 'window' (for webpack 4)
    }, 
    optimization: {
        minimize: opt.minimize,
        minimizer: opt.minimize ? [ minimizerConfig(opt.ecma) ] : [],
    },
}); 

const buildConfigurations = Array.from(genCombinations({
    target: [ 
        { lib: 'umd',  name: 'umd', },
        { lib: 'amd',  name: 'amd', },
        { lib: 'cjs', name: 'commonjs2', },
    ],
    minimize: [ false, true ],
    ecma: [ 5, 6, ],
})).map(webpackConfig);

module.exports = buildConfigurations;
