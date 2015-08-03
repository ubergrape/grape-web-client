var webpack = require('webpack')

module.exports = exports = {
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
      __TEST__: process.env.NODE_ENV === 'test'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [
    /*
      FIXME
      {
        loader: 'react-hot',
        test: /\.js$/,
        exclude: /node_modules/
      },
    */
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
    react: 'React'
  }
}