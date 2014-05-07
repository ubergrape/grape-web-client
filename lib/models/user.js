/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Model = require('model');
var cache = require('model-cache');

module.exports = new Model([
		'username',
		'firstName',
		'lastName',
		'status',
		'avatar'
	])
	.use(cache('id'))
	.use(defaultAvatar('images/avatar.gif'));

function defaultAvatar(url) {
	return function (Model) {
		Model.on('construct', function (instance, initial) {
			initial.avatar = initial.avatar || ui.static(url);
		});
	};
}
