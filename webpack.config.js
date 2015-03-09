var webpack = require('webpack')

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
]

if (process.env.COMPRESS) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  )
}

var config = module.exports = {
  node: {
    Buffer: false
  },

  plugins: plugins,

  module: {
    loaders: [
      {
        loader: '6to5-loader',
        test: /\.js$/,
        include: [
          __dirname + '/index.js',
          __dirname + '/component.js',
          __dirname + '/src',
          __dirname + '/node_modules/lodash-es',
          __dirname + '/node_modules/ubergrape-theme',
          __dirname + '/node_modules/ubergrape-jss-utils'
        ]
      },
      {
        loader: 'json-loader',
        test: /\.json$/
      }
    ]
  }
}

config.externals = {
  react: 'React'
}
