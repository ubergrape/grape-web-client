/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Model = require('model');
var cache = require('model-cache');
var cast = require('model-cast');
var array = require('model-array');

var User = require('./user');

module.exports = new Model([
		'author',
		'time',
		'read' // to track if the current user has read the line
	])
	.use(cache('id'))
	.use(cast)
	.cast('author', castAuthor)
	.cast('time', cast.Date)
	.use(array)
	.array('readers');

function castAuthor(author) {
	var ret;
	if (author.type === 'user') 
		ret = User.get(author.id);
	if (author.type === 'service')
		ret = {
			'id': author.id,
			'username': author.id
		}
	// the ype is needed in the template to know what kind of message this is
	ret.type = author.type;
	return ret;
}
