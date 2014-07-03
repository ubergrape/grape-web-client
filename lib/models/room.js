/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Model = require('model');
var cache = require('model-cache');
var array = require('model-array');

module.exports = new Model([
		'name',
		'slug',
		// TODO: ideally the room should not contain user specific data?
		'joined',
		'unread',
		'mentioned'
	])
	.use(cache('id'))
	.use(array)
	.array('history', {events: false})
	.array('users', {childEvents: true}) // TODO: maybe make this a map?
	.use(children);

// some internal lookup maps
function children(Model) {
	Model.on('construct', function (instance) {
		// a map of typing user ids
		instance.typing = Object.create(null);
		// this is a map from user ids to lines read by the user
		instance._readingStatus = Object.create(null);
	});
}

