/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var exports = module.exports = require('emitter')({});

exports.state = 'focus';

window.addEventListener('blur', function () {
	exports.state = 'blur';
	exports.emit('change', exports.state);
	exports.emit('blur');
});
window.addEventListener('focus', function () {
	exports.state = 'focus';
	exports.emit('change', exports.state);
	exports.emit('focus');
});

// TODO: maybe use `yields/visibility`?
//var visibility = require('visibility');
//visibility(function () {
//	console.log(arguments);
//});
