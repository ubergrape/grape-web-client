var jadeV = require('require-cwd')('jade-virtualdom');
var loaderUtils = require('loader-utils');

module.exports = function(source) {
	var filePath = loaderUtils.getRemainingRequest(this).replace(/^!/, "");
	return 'module.exports = ' + jadeV(source, {filename: filePath}).toString();
}