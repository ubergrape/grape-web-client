/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Model = require('model');
var cache = require('model-cache');
var array = require('model-array');
var staticurl = require('staticurl');

module.exports = new Model([
		'logo',
		'role',
		'custom_emojis'
	])
	.use(cache('id'))
	.use(array)
	.array('rooms')
	.array('pms')
	.array('users')
	.use(defaultLogo('images/logo-white.svg'));

function defaultLogo(url) {
	return function (Model) {
		Model.on('construct', function (instance, initial) {
			initial.logo = initial.logo || staticurl(url);
		});
	};
}

