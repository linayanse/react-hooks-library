const path = require('path');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.config.common');

module.exports = merge(
  commonConfig,
  {
    mode: 'production',
    entry: './src/index.ts',
    devtool: 'source-map',
    output: {
      filename: 'react-hooks-library.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'react-hooks-library',
      libraryTarget: 'umd',
    },
    externals : {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      },
      numeral: {
        root: 'numeral',
        commonjs2: 'numeral',
        commonjs: 'numeral',
        amd: 'numeral'
      },
      moment: {
        root: 'moment',
        commonjs2: 'moment',
        commonjs: 'moment',
        amd: 'moment'
      },
      lodash : {
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
        root: '_' // indicates global variable
      }
    },
  }
);