var merge = require('lodash/object/merge')
var webpackConfig = require('./webpack.config')

module.exports = merge(webpackConfig, {
  entry: {
    embedded: ['babel-polyfill', './src/embedded.js'],
    app: ['babel-polyfill', './src/index.js']
  },
  output: {
    filename: '[name].js'
  }
})
