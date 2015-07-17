var jadeV = require('require-cwd')('jade-virtualdom');
var loaderUtils = require('loader-utils');

module.exports = function(source) {
	this.cacheable && this.cacheable();
	var filepath = loaderUtils.getRemainingRequest(this).replace(/^!/, "");
//	var transform = "require.modules['bubi'] = function(exports, module) {";
//	var res = "require.modules['bubi'] = function(exports, module) { module.exports = " + jadeV(source).toString() + " };";
//	return "module.exports= " + jadeV(source, {filename: filepath}).toString();
	return "require.modules['bubi'] = " + jadeV(source, {filename: filepath}).toString();
}