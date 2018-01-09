var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyFilesPlugin = require('copy-webpack-plugin')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var NODE_ENV = process.env.NODE_ENV
var STATIC_PATH = process.env.STATIC_PATH
var isDevServer = process.argv[1].indexOf('webpack-dev-server') !== -1
var ANALIZE = process.env.ANALIZE

var plugins = [
  new CopyFilesPlugin([{
    from: './src/images',
    to: './images'
  }]),
  new CopyFilesPlugin([{
    from: './src/fonts',
    to: './fonts'
  }]),
  new CopyFilesPlugin([{
    from: './src/sounds',
    to: './sounds'
  }]),
  new webpack.DefinePlugin({
    __DEV__: !NODE_ENV || NODE_ENV === 'development',
    __TEST__: NODE_ENV === 'test',
    __IS_DEV_SERVER__: isDevServer,
    __VERSION__: require('./package.json').version,
    __STATIC_PATH__: JSON.stringify(STATIC_PATH),
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
  }),
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|de/)
]

module.exports = exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist/app'),
    filename: 'app.js',
    library: 'grapeClient'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /.svg$/,
        loader: 'raw-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  plugins: plugins,
  resolve: {
    alias: {
      'emitter': 'component-emitter'
    },
    // Workaround for simlinked dependencies.
    // This will help to find dependency in the parent package if missing in a
    // symlinked one.
    // http://webpack.github.io/docs/troubleshooting.html
    // https://github.com/webpack/webpack/issues/784
    modules: [path.resolve(__dirname, 'node_modules'), 'web_modules', 'node_modules']
  },
  devtool: NODE_ENV === 'production' ? 'source-map' : 'cheap-source-map'
}

if (isDevServer) {
  exports.output.publicPath = '/static/app/'
}

if (NODE_ENV === 'production') {
  exports.plugins.push(
    // This plugin turns all loader into minimize mode!!!
    // https://github.com/webpack/webpack/issues/283
    new UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  )
  exports.performance = {
    hints: "error",
    maxEntrypointSize: 2650 * 1024,
    maxAssetSize: 2650 * 1024
  }
}

if (ANALIZE) {
  exports.plugins.push(new BundleAnalyzerPlugin())
}
