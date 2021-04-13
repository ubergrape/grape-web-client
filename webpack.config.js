const path = require('path')
const webpack = require('webpack')
const CopyFilesPlugin = require('copy-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const TerserPlugin = require('terser-webpack-plugin')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const { NODE_ENV, STATIC_PATH, APP, ANALIZE, THEME, PRODUCT_NAME } = process.env
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
    __THEME__: JSON.stringify(THEME),
    // using JSON.stringify for 'Grape' to receive string in code - https://webpack.js.org/plugins/define-plugin/#usage
    __PRODUCT_NAME__: JSON.stringify(PRODUCT_NAME) || JSON.stringify('Grape'),
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  }),
  new webpack.ContextReplacementPlugin(/moment[\\]locale$/, /en|de/),
  new webpack.optimize.ModuleConcatenationPlugin(),
  new LodashModuleReplacementPlugin({
    shorthands: true,
    collections: true,
    flattening: true,
    paths: true,
  }),
  new DuplicatePackageCheckerPlugin(),
]

const exportsObject = {
  target: 'web',
  mode: NODE_ENV === 'production' ? 'production' : 'development',
  entry: () => {
    const app = ['idempotent-babel-polyfill', './src/index.js']
    const embedded = ['idempotent-babel-polyfill', './src/embedded.js']
    if (APP === 'full') return { app }
    if (APP === 'embedded') return { embedded }
    return { app, embedded }
  },
  output: {
    path: path.resolve(__dirname, 'dist/app'),
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'grapeClient',
  },
  devServer: {
    writeToDisk: true,
  },
  bail: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
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
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader'],
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

module.exports = exportsObject

if (isDevServer) {
  exportsObject.output.publicPath = '/static/app/'
}

if (NODE_ENV === 'production') {
  exportsObject.optimization = {
    minimize: true,
    minimizer: [new TerserPlugin()],
  }
  exportsObject.performance = {
    hints: 'error',
    maxEntrypointSize: 4200 * 1024,
    maxAssetSize: 4200 * 1024,
  }
}

if (ANALIZE) {
  exportsObject.plugins.push(new BundleAnalyzerPlugin())
}
