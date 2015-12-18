var webpack = require('webpack')

module.exports = exports = {
  entry: {
    browser: ['webpack/hot/dev-server', './src/index.js'],
    emoji: ['./src/emoji/index.js']
  },

  output: {
    path: './examples/build',
    publicPath: '/build/',
    libraryTarget: 'var',
    library: '[name]',
    filename: '[name].js'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __DEV__: process.env.NODE_ENV === 'development',
      __TEST__: process.env.NODE_ENV === 'test'
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
      }
    ]
  }
}

if (process.env.NODE_ENV === 'development') {
  exports.externals = {
    'emoji': './src/emoji',
    'React': 'react',
    'ReactDOM': 'react-dom'
  }
}
