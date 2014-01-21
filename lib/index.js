/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Wamp = require('wamp1');
var WebSocketBuffering = require('websocket-buffering');
var Adapter = require('./adapter');

/**
 * This depends on some settings and is therefore a function that
 * has some late-binding for the models.
 */
module.exports = function (options, fn) {
	options = options || {};
	var exports = {};

	var ws = new WebSocketBuffering(options.websocket);
	var wamp = exports.wamp = new Wamp(ws);

	// expose models with transparent adapter over wamp
	Adapter.channel = wamp;
	var models = exports.models = {};
	models.Room = require('./models/room');
	var User = models.User = require('./models/user');

	// FIXME: the call actually needs to work with prefixes
	wamp.prefix('http://domain/users/', 'users');

	wamp.call('http://domain/users/get_profile', function (err, res) {
		exports.user = User.self = new User(res);
		fn(undefined, exports);
	});

	return exports;
};

