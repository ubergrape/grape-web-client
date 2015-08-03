var webpack = require('webpack')
var webpackConfig = require('./webpack.config')
var assign = require('lodash/object/assign')


module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],
    singleRun: process.env.NODE_ENV !== 'test',
    files: [
      'tests.webpack.js'
    ],
    frameworks: ['mocha'],
    plugins: [
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
    ],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },
    reporters: ['dots'],
    webpack: assign(webpackConfig, {
      devtool: 'inline-source-map'
    }),
    webpackServer: {
      noInfo: true
    },
    webpackMiddleware: {
      noInfo: true
    }
  })
}
