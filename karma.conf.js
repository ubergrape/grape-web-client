var webpack = require('webpack')
var assign = require('lodash/object/assign')

module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],
    singleRun: process.env.NODE_ENV != 'test',
    frameworks: ['mocha'],
    files: [
      'tests.webpack.js'
    ],
    preprocessors: {
      'tests.webpack.js': ['webpack']
    },
    reporters: ['dots'],
    webpack: assign(require('./webpack.config'), {
      watch: true
    }),
    webpackServer: {
      noInfo: true
    }
  })
}
