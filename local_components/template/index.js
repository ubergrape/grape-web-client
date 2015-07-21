module.exports = template;
var templates = require('../../templates')
console.log(templates);

function template(name, locals) {
	locals = extend(extend({}, template.locals), locals || {});
	return templates[name](locals);
}

template.locals = {};

function extend(a, b) {
	for (var k in b) {
		a[k] = b[k];
	}
	return a;
}