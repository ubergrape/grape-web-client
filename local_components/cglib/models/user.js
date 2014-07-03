/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Model = require('model');
var cache = require('model-cache');
var staticurl = require('staticurl');

module.exports = new Model([
		'username',
		'firstName',
		'lastName',
		'status',
		'avatar',
        'is_only_invited'
	])
	.use(cache('id'))
	.use(defaultAvatar('images/avatar.gif', 'images/avatar_invited.gif'));

function defaultAvatar(url, url_invited) {
	return function (Model) {
		Model.on('construct', function (instance, initial) {
            if (initial.is_only_invited) {
                initial.avatar = staticurl(url_invited);
            }
			initial.avatar = initial.avatar || staticurl(url);
		});
	};
}
