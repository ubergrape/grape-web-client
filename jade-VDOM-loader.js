var jadeV = require('require-cwd')('jade-virtualdom');
var loaderUtils = require('loader-utils');
var root = 'templates/';

module.exports = function(source) {
	var filePath = loaderUtils.getRemainingRequest(this).replace(/^!/, "");
	var splitPath = filePath.split(root);
	var fileName = splitPath[splitPath.length - 1];
	return jadeV(source, {filename: filePath}).toString();
}