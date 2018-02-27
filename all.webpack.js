var merge = require('lodash/internal/baseMerge')
var webpackConfig = require('./webpack.config')

module.exports = merge(webpackConfig, {
  entry: {
    embedded: './src/embedded.js',
    app: './src/index.js'
  },
  output: {
    filename: '[name].js'
  }
})
