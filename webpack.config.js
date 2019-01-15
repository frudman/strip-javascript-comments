'use strict'

// to run minimizer: npm run build
// then, to run tests: npm run test

// "maintained" minimizer for webpack (from https://github.com/terser-js/terser)
const TerserPlugin = require('terser-webpack-plugin');

const baseConfig = {
    mode: 'production',
    entry: './index.js',
    output: { 
        path: __dirname, 
    }, 
    optimization: {
        minimize: false,
    },
}
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

// helper
const deepClone = obj => JSON.parse(JSON.stringify(obj));

// utility
function genCombos(options, cb) {
    // options is an object where each property contains alternatives (an array)
    // cb will be called with ALL COMBINATIONS of these properties

    const props = Object.keys(options);
    if (props.length === 0) return;

    const thisProp = props[0],
          propAlts = options[thisProp]; // an array of values

    if (props.length === 1)
        propAlts.forEach(alt => cb({ [thisProp]: alt }));
    else {
        const otherProps = deepClone(options);
        delete otherProps[thisProp]; 
        propAlts.forEach(v => genCombos(otherProps, subAlts => cb(Object.assign({ [thisProp]: v }, subAlts))))
    }
}

function genBuildConfiguration(opt) {
    const config = deepClone(baseConfig),
          es = () => opt.ecma === 5 ? '' : `.es${opt.ecma}`;

    config.output.filename = `dist/strip-comments${es()}${opt.target.ext}${opt.minimize?'.min':''}.js`;
    config.output.libraryTarget = opt.target.name;

    if (config.optimization.minimize = opt.minimize)
        config.optimization.minimizer = [ minimizerConfig(opt.ecma) ];

    return config;
}

const buildConfigurations = [];

genCombos({
    target: [ 
        { name: 'umd', ext: '', },
        { name: 'amd', ext: '.amd', },
        { name: 'commonjs2', ext: '.cjs', }
    ],
    minimize: [ false, true ],
    ecma: [ 5, 6, ],
}, opts => buildConfigurations.push(genBuildConfiguration(opts)));

module.exports = buildConfigurations;
