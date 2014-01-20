/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Model = require('model');
var cache = require('model-cache');

module.exports = new Model(['name'])
	.use(cache('id'))
	.use(number);

// gives each user a monotonically increasing number
var numUsers = 0;
function number(Model) {
	Model.on('construct', function (instance, initial) {
		instance.num = (numUsers++) % 20; // TODO: sync with style
	});
}
