/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Wamp = require('wamp1');
var Adapter = require('./adapter');

// expose models with transparent adapter over wamp
var models = exports.models = {};
models.Room = require('./models/room');

// TODO: need some way to configure the settings in both node and browser
var HOST = 'ws://' + (typeof location === 'undefined' ? 'localhost:8080' : location.host);

var wamp = exports.wamp = new Wamp(HOST, function () {
	// TODO: support omitting the welcome callback in wamp1
});

// FIXME: this late binding is really bad :-(
Adapter.channel = wamp;

// just some debugging for now, nothing more
wamp.socket.on('error', function () {
	console.log(arguments);
});
wamp.socket.on('message', function (msg) {
	if (msg.data)
		msg = msg.data;
	console.log(msg);
});

