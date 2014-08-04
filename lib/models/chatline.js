/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Model = require('model');
var cache = require('model-cache');
var cast = require('model-cast');
var array = require('model-array');

var User = require('./user');
var Channel = require('./room');

module.exports = new Model([
		'author',
		'channel',
		'time',
		'user_time',
		'read' // to track if the current user has read the line
	])
	.use(cache('id'))
	.use(cast)
	.cast('author', castAuthor)
	.cast('channel', castChannel)
	.cast('time', cast.Date)
	.cast('user_time', cast.Date)
	.use(array)
	.array('readers');

function castAuthor(author) {
	if (author.type === 'user') {
		var user = User.get(author.id);
		if (user)
			user['type'] = 'user';
		return user;
	}

	if (author.type === 'service'){
		return {
			'id': author.id,
			'username': author.id,
			'type': 'service'
		};
	}

	return author;
}


// for display in search results we need the channel name as well
function castChannel(channel) {
	var ch = Channel.get(channel);
	if (ch)
		return ch;
	return channel;
}
