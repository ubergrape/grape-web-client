/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Model = require('model');
var array = require('model-array');

var User = require('./user');

module.exports = new Model()
	.use(linkUser)
	.use(array)
	.array('readers');

// automatically casts user to a user object based on the users id
var lines = 0;
function linkUser(Model) {
	Model.on('construct', function (instance, initial) {
		// FIXME: this is also something the server will eventually do for us
		initial.time = new Date();
		initial.id = lines++;
	});
}
