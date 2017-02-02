var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyFilesPlugin = require('copy-webpack-plugin')

var appExtractText = new ExtractTextPlugin('app.css')
var componentsExtractText = new ExtractTextPlugin('components.css')

var NODE_ENV = process.env.NODE_ENV
var STATIC_PATH = process.env.STATIC_PATH
var isDevServer = process.argv[1].indexOf('webpack-dev-server') !== -1


var plugins = [
  appExtractText,
  componentsExtractText,
  new CopyFilesPlugin([{
    from: './src/images',
    to: './images'
  }]),
  new CopyFilesPlugin([{
    from: './src/sounds',
    to: './sounds'
  }]),
  new webpack.DefinePlugin({
    __DEV__: NODE_ENV === 'development',
    __TEST__: NODE_ENV === 'test',
    __STATIC_PATH__: JSON.stringify(STATIC_PATH),
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
  })
]

module.exports = exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: './dist/app',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: componentsExtractText.extract('style-loader', 'css-loader')
      },
      {
        test: /\.styl$/,
        loader: appExtractText.extract('css-loader!autoprefixer-loader!stylus-loader?paths=node_modules/stylus/')
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      {
        // Font files need to be in a font dir, because we want to import
        // svg's raw too.
        test: /fonts\/.+\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
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
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.jade$/,
        loader: 'jade-VDOM-loader'
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
    subDirectories: true,
    // Workaround for simlinked dependencies.
    // This will help to find dependency in the parent package if missing in a
    // symlinked one.
    // http://webpack.github.io/docs/troubleshooting.html
    // https://github.com/webpack/webpack/issues/784
    fallback: path.join(__dirname, 'node_modules')
  },
  devtool: NODE_ENV === 'production' ? 'source-map' : 'cheap-source-map'
}


if (isDevServer) {
  var contentBase = './src'

  if (process.env.COMPONENT) {
    contentBase = './src/components/' + process.env.COMPONENT + '/example/'
  }

  exports.output.publicPath = '/dist/app/'
  exports.plugins.push(new webpack.HotModuleReplacementPlugin())
  exports.entry = {
    browser: [
      'webpack/hot/dev-server',
      contentBase + '/index.js'
    ]
  }
  exports.devServer = {contentBase: contentBase}
}

if (NODE_ENV === 'production') {
  exports.plugins.push(
    // This plugin turns all loader into minimize mode!!!
    // https://github.com/webpack/webpack/issues/283
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  )
}

