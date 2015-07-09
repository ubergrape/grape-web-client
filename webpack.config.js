var path = require('path');

module.exports = {
	entry: path.resolve(__dirname, 'index.js'),
	output: {
		path: path.resolve(__dirname, 'loip'),
		filename: 'loip.js',
	},
	resolve: {
		alias: {
		    "classes": "component-classes",
		    "clipboard": "component-clipboard",
		    "closest": "component-closest",
		    "dialog": "dialog-component",
		    "emitter": "component-emitter",
		    "file": "component-file",
		    "notification": "component-notification",
		    "page": "visionmedia-page.js",
		    "progress": "progress-component",
		    "query": "component-query",
		    "raf": "component-raf",
		    "resizable": "jh3y-resizable",
		    "upload": "component-upload"	
		},
		modulesDirectories: [
			"lib",
			"local_components",
			"node_modules"
		],
		subDirectories: true
	}
};