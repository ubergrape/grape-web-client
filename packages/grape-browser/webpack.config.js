const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: ['webpack/hot/dev-server', './src/index.js'],
  output: {
    path: './examples/build',
    publicPath: '/build/',
    filename: 'grape-browser.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __DEV__: process.env.NODE_ENV === 'development',
      __TEST__: process.env.NODE_ENV === 'testing',
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
        test: /.svg$/,
        loaders: ['raw-loader'],
      },
    ],
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'node_modules')],
  },
}
