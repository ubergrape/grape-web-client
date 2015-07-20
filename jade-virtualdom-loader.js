var jadeV = require('require-cwd')('jade-virtualdom');
var loaderUtils = require('loader-utils');

module.exports = function(source) {
	this.cacheable && this.cacheable();
	var filepath = loaderUtils.getRemainingRequest(this).replace(/^!/, "");
	return source;
}