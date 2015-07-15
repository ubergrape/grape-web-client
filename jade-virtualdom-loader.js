var jadeV = require('require-cwd')('jade-virtualdom');

module.exports = function(source) {
	this.cacheable();
	var res = jadeV(source).toString();
	return 'module.exports = ' + res;
}