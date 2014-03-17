/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Model = require('model');
var cache = require('model-cache');
var array = require('model-array');

module.exports = new Model()
	.use(cache('id'))
	.use(array)
	.array('rooms')
	.array('pms')
	.array('users');

