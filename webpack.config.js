// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack')

const config = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __DEV__: process.env.NODE_ENV === 'development',
      __TEST__: process.env.NODE_ENV === 'test',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],

  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
      },
      {
        loader: 'json-loader',
        test: /\.json$/,
      },
    ],
  },
}

module.exports = config
