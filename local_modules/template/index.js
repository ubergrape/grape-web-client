function template(name, locals) {
	locals = extend(extend({}, template.locals), locals || {});
	if (!template.templates[name]) throw new Error('Tempalte not found: ' + name)
	return template.templates[name](locals);
}

module.exports = template;

template.locals = {};

function extend(a, b) {
	for (var k in b) {
		a[k] = b[k];
	}
	return a;
}