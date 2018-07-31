const path = require('path')
const webpack = require('webpack')
const CopyFilesPlugin = require('copy-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')

const { NODE_ENV, STATIC_PATH, APP, ANALIZE } = process.env
const isDevServer = process.argv[1].indexOf('webpack-dev-server') !== -1

const plugins = [
  new CopyFilesPlugin([
    {
      from: './src/images',
      to: './images',
    },
  ]),
  new CopyFilesPlugin([
    {
      from: './src/fonts',
      to: './fonts',
    },
  ]),
  new CopyFilesPlugin([
    {
      from: './src/sounds',
      to: './sounds',
    },
  ]),
  new webpack.DefinePlugin({
    __DEV__: !NODE_ENV || NODE_ENV === 'development',
    __TEST__: NODE_ENV === 'test',
    __STATIC_PATH__: JSON.stringify(STATIC_PATH),
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  }),
  new webpack.ContextReplacementPlugin(/moment[\\]locale$/, /en|de/),
  new DuplicatePackageCheckerPlugin(),
]

const exports = {
  entry: () => {
    const app = ['babel-polyfill', './src/index.js']
    const embedded = ['babel-polyfill', './src/embedded.js']
    if (APP === 'full') return { app }
    if (APP === 'embedded') return { embedded }
    return { app, embedded }
  },
  output: {
    path: path.resolve(__dirname, 'dist/app'),
    filename: '[name].js',
    library: 'grapeClient',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: ['src', 'node_modules/pretty-bytes'].map(dir =>
          path.resolve(__dirname, dir),
        ),
      },
      {
        test: /.svg$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=8192',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
  plugins,
  resolve: {
    alias: {
      emitter: 'component-emitter',
    },
    // Workaround for simlinked dependencies.
    // This will help to find dependency in the parent package if missing in a
    // symlinked one.
    // http://webpack.github.io/docs/troubleshooting.html
    // https://github.com/webpack/webpack/issues/784
    modules: [
      path.resolve(__dirname, 'node_modules'),
      'web_modules',
      'node_modules',
    ],
  },
  devtool: NODE_ENV === 'production' ? 'source-map' : 'cheap-source-map',
}

module.exports = exports

if (isDevServer) {
  exports.output.publicPath = '/static/app/'
}

if (NODE_ENV === 'production') {
  exports.plugins.push(
    // This plugin turns all loader into minimize mode!!!
    // https://github.com/webpack/webpack/issues/283
    new UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  )
  exports.performance = {
    hints: 'error',
    maxEntrypointSize: 2850 * 1024,
    maxAssetSize: 2650 * 1024,
  }
}

if (ANALIZE) {
  exports.plugins.push(new BundleAnalyzerPlugin())
}
