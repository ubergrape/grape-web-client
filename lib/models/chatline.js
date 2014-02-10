/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Model = require('model');
var cast = require('model-cast');
var array = require('model-array');

var User = require('./user');

module.exports = new Model([
		'user',
		'time'
	])
	.use(cast)
	.cast('user', cast.Cache(User))
	.cast('time', cast.Date)
	.use(array)
	.array('readers');

