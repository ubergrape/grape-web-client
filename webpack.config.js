var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: {
    browser: ['webpack/hot/dev-server', './src/index.js']
  },
  output: {
    path: './examples/build',
    publicPath: '/build/',
    filename: 'grape-browser.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __DEV__: process.env.NODE_ENV === 'development',
      __TEST__: process.env.NODE_ENV === 'testing'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        loader: 'json-loader',
        test: /\.json$/
      },
      {
        test: /.svg$/,
        loaders: [
          'raw-loader',
          'svgo-loader?' + JSON.stringify({
            plugins: [{removeTitle: true}]
          })
        ],
        include: /node_modules/
      }
    ]
  },
  resolve: {
    fallback: path.join(__dirname, 'node_modules')
  }
}
