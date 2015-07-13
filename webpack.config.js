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
        loader: 'babel-loader?stage=0',
        test: /\.js$/
      },
      {
        loader: 'json-loader',
        test: /\.json$/
      }
    ]
  }
}

config.externals = {
  react: 'React',
  'reactive-elements': 'ReactiveElements'
}
