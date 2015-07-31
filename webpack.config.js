var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var appETP = new ExtractTextPlugin('app.css');
var componentETP = new ExtractTextPlugin('components.css');
var outputPath = '../chatgrape/static/app';

module.exports = {
	entry: path.resolve(__dirname, 'src/index.js'),
	output: {
		path: path.resolve(outputPath),
		filename: 'app.js'
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: componentETP.extract('style-loader','css-loader')
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
				loader: "url-loader?limit=10000&minetype=application/font-woff"
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "file-loader"
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
		subDirectories: true
	}
};
