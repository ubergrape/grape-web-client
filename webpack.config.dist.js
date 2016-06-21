var config = require('./webpack.config.base')

config.output.path = './dist'

if (process.env.COMPONENT) {
  config.output.publicPath = '/dist/'
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  var contentBase = './src/components/' + process.env.COMPONENT + '/example/'
  config.entry = {
    browser: [
      'webpack/hot/dev-server',
      contentBase + '/index.js'
    ]
  }
  config.devServer = {contentBase: contentBase}
}


module.exports = config
