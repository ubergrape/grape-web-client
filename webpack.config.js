var path = require('path');
var extractTextPlugin = require('extract-text-webpack-plugin');
var jadeVirtualDomLoader = require('./jade-virtualdom-loader');

module.exports = {
	entry: path.resolve(__dirname, 'index.js'),
	output: {
		path: path.resolve(__dirname, 'loip'),
		filename: 'loip.js',
	},
	module: {
		loaders: [
			{
				test: /\.styl$/,
				loader: extractTextPlugin.extract('style-loader!css-loader!stylus-loader')
			},
			{
				test: /\.js$/,
				loader: 'babel-loader?stage=0'
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			},
			{
				test: /\.jade$/,
				loader: jadeVirtualDomLoader
			}
		]
	},
	plugins: [
		new extractTextPlugin('./loip/styles.css')
	],
	resolve: {
		alias: {
			'classes': 'component-classes',
			'clipboard': 'component-clipboard',
			'closest': 'component-closest',
			'dialog': 'dialog-component',
			'emitter': 'component-emitter',
			'file': 'component-file',
			'page': 'visionmedia-page.js',
			'progress': 'progress-component',
			'query': 'component-query',
			'raf': 'component-raf',
			'resizable': 'jh3y-resizable',
			'upload': 'component-upload'	
		},
		modulesDirectories: [
			'lib',
			'local_components',
			'node_modules'
		],
		subDirectories: true
	}
};
