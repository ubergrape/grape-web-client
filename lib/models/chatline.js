/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Model = require('model');
var cache = require('model-cache');
var cast = require('model-cast');
var array = require('model-array');

var User = require('./user');

module.exports = new Model([
		'user',
		'time',
		'read' // to track if the current user has read the line
	])
	.use(cache('id'))
	.use(cast)
	.cast('user', cast.Cache(User))
	.cast('time', cast.Date)
	.use(array)
	.array('readers');

