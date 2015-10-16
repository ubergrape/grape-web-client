/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Model = require('model');
var cache = require('model-cache');
var staticurl = require('staticurl');

module.exports = new Model([
		'username',
		'firstName',
		'lastName',
		'displayName',
		'status',
		'avatar',
		'email',
		'skype_username',
		'phone_number',
		'what_i_do',
		'is_only_invited',
		'role',
		'title',
		'pm',
		'slug'
	])
	.use(cache('id'))
	.use(defaultAvatar('images/avatar.gif', 'images/avatar_invited.gif'))
	.use(setSlug());

function defaultAvatar(url, urlInvited) {
	return function (Model) {
		Model.on('construct', function (instance, initial) {
			if (initial.is_only_invited) {
				initial.avatar = staticurl(urlInvited);
			}
			initial.avatar = initial.avatar || staticurl(url);
		});
	};
}

function setSlug() {
	return Model => {
		Model.on('construct', (instance, initial) => {
			initial.slug = `@${initial.username}`
		})
	}
}
