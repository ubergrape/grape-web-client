var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var appETP = new ExtractTextPlugin('app.css')
var componentETP = new ExtractTextPlugin('components.css')

/**
 * Ignores 'require' calls from `ignoredModules` list.
 * Electron wrapper adds own `require` and
 * we need to do not handle them in webpack build.
 */
var ignoredModules = ['electron', 'remote']
function ignoreModules(context, request, callback) {
  if (ignoredModules.indexOf(request) >= 0) {
    return callback(null, 'require(\'' + request + '\')')
  }
  return callback()
}

module.exports = {
  entry: './src/index.js',
  output: {
    path: '../chatgrape/static/app',
    filename: 'app.js'
  },
  externals: [ignoreModules],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: componentETP.extract('style-loader', 'css-loader')
      },
      {
        test: /\.styl$/,
        loader: appETP.extract('css-loader!autoprefixer-loader!stylus-loader?paths=node_modules/stylus/')
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?stage=0',
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
  plugins: [
    componentETP,
    appETP,
    new webpack.DefinePlugin({
      __DEV__: process.env.NODE_ENV === 'development',
      __TEST__: process.env.NODE_ENV === 'test'
    })
  ],
  resolve: {
    alias: {
      'classes': 'component-classes',
      'clipboard': 'component-clipboard',
      'closest': 'component-closest',
      'dialog': 'dialog-component',
      'emitter': 'component-emitter',
      'file': 'component-file',
      'progress': 'progress-component',
      'query': 'component-query',
      'raf': 'component-raf',
      'resizable': 'jh3y-resizable',
      'upload': 'component-upload',
      'events': 'component-events'
    },
    subDirectories: true,
    // Workaround for webpack bug https://github.com/webpack/webpack/issues/784
    // This will help to find dependency missing in a linked package.
    // http://webpack.github.io/docs/troubleshooting.html
    fallback: path.join(__dirname, 'node_modules')
  }
}
