var webpackConfig = require('./webpack.base.config')

webpackConfig.entry.emoji = ['./src/emoji/index.js']
webpackConfig.output.filename = '[name].js'
webpackConfig.output.library = '[name]'
webpackConfig.output.libraryTarget = 'var'
webpackConfig.externals = {
  emoji: './src/emoji',
  React: 'react',
  ReactDOM: 'react-dom'
}

module.exports = exports = webpackConfig
