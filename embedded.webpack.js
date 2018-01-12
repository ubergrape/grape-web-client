var merge = require('lodash/internal/baseMerge')
var path = require('path')
var webpackConfig = require('./webpack.config')

module.exports = merge(webpackConfig, {
  entry: ['babel-polyfill', './src/embedded.js'],
  output: {
    filename: 'embedded.js'
  }
})
