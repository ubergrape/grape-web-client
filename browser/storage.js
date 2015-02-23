// extends the store component with
// the check functionality that warns
// when a prefix that is already in use
// is being used.

var Store = require('store');

var prefixes = new Array();

module.exports = Store;

var protoPrefix = Store.prefix;

Store.prefix = function (prefix) {
	check(prefix);
	return protoPrefix.call(this, prefix);
}

function check(prefix) {
	if (prefixes.indexOf(prefix) > -1) console.warn('Prefix ' + prefix + ' is already taken');
	prefixes.push(prefix);
}