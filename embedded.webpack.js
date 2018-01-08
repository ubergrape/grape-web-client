var assign = require('lodash/object/assign')
var path = require('path')
var webpackConfig = require('./webpack.config')

module.exports = assign(webpackConfig, {
  entry: ['babel-polyfill', './src/embedded.js'],
  output: {
    path: path.resolve(__dirname, 'dist/app'),
    publicPath: '/static/app',
    filename: 'embedded.js',
    library: 'grapeClient'
  }
})
