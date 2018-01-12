var merge = require('lodash/internal/baseMerge')
var path = require('path')
var webpackConfig = require('./webpack.config')

module.exports = merge(webpackConfig, {
  output: {
    filename: 'embedded.js'
  }
})
