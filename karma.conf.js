var webpack = require('webpack')
var webpackConfig = require('./webpack.config')
var assign = require('lodash/object/assign')

module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],
    singleRun: !process.env.WATCH,
    files: [
      'tests.webpack.js'
    ],
    frameworks: ['mocha'],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha'],
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
