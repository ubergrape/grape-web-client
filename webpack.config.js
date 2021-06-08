const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: ['webpack/hot/dev-server', './src/index.js'],
  output: {
    path: `${__dirname}/examples/build`,
    publicPath: '/build/',
    filename: 'grape-browser.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: process.env.NODE_ENV === 'development',
      __TEST__: process.env.NODE_ENV === 'testing',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        resolve: {
          fullySpecified: false,
        },
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /.svg$/,
        use: ['raw-loader'],
      },
    ],
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'node_modules')],
  },
}
