/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Wamp = require('wamp1');
var WebSocketBuffering = require('websocket-buffering');
var Adapter = require('./adapter');

/**
 * This depends on some settings and is therefore a function that
 * has some late-binding for the models.
 */
module.exports = function (options) {
	options = options || {};
	var exports = {};

	var ws = new WebSocketBuffering(options.websocket);
	var wamp = exports.wamp = new Wamp(ws);

	// expose models with transparent adapter over wamp
	Adapter.channel = wamp;
	var models = exports.models = {};
	models.Room = require('./models/room');
	models.User = require('./models/user');

	return exports;
};

