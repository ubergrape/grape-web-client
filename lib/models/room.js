/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Model = require('model');
//var Cache = require('model-cache');
var array = require('array');

var Line = require('./chatline');
var User = require('./user');
var adapter = require('../adapter');

var URI = 'http://cg.api/rooms/'; // FIXME: move the uri to some central config

module.exports = new Model(['name'])
	//.use(Cache('pk'))
	.use(children)
	.use(adapter(URI, handleEvent))
	.use(publish);

// Adds `history` and `users` properties as interactive arrays
function children(Model) {
	Model.on('construct', function (instance) {
		// history is good to have as a flat array
		instance.history = array();
		// TODO: do we keep this as a flat array or make it a map?
		instance.users = array();
		// this is a map of line ids to lines.
		instance._lines = Object.create(null);
		// this is a map from user ids to lines read by the user
		instance._readingStatus = Object.create(null);
	});
}

// handling subscription messages
function handleEvent(instance, msg) {
	if (msg.type === 'message') {
		var line = new Line(msg.message);
		instance._lines[line.id] = line;
		instance.history.push(line);
	} else if (msg.type === 'reading') {
		var last = instance._readingStatus[msg.user];
		var user = User.get(msg.user);
		// remove the user from the last lines readers
		if (last) {
			var i = last.readers.indexOf(user);
			last.readers.splice(i, 1);
		}
		// and add it to the new line
		var line = instance._lines[msg.line];
		line.readers.push(user);
		instance._readingStatus[msg.user] = line;
	} else
		console.log('unhandled', msg);
}

// register a send method on the Room
function publish(Model) {
	Model.on('construct', function (instance) {
		// FIXME: ideally, this would be a class method, not an instance property
		var publish = instance.publish;
		instance.publish = function (msg) {
			// FIXME: we need to send the user id with the message for now, later the
			// server will do that for us
			// FIXME: uhhhhh, this sessionId is very ugly :-(
			msg = {
				type: 'message',
				message: {message: msg, user: adapter.channel.sessionId}
			};
			publish.call(this, msg);
		};
	});
}
