/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Wamp = require('wamp1');
var WebSocketBuffering = require('websocket-buffering');

var models = exports.models = {
	Room: require('./models/room'),
	User: require('./models/user'),
	Line: require('./models/chatline'),
};

exports.App = App;

function App(options, fn) {
	options = options || {};

	this.user = undefined;
	this.org = undefined;
	this.organizations = undefined;
	this.users = undefined;
	this.rooms = undefined;

	this.init(options, fn);
}

var PREFIX = 'http://domain/';

/**
 * Initializes the connection and gets all the user profile and organization
 * details and joins the first one.
 */
App.prototype.init = function App_init(options, fn) {
	var wamp = this.wamp = new Wamp(new WebSocketBuffering(options.websocket));
	var self = this;
	wamp.call(PREFIX + 'users/get_profile', loadProfile);
	function loadProfile(err, res) {
		if (err)
			return fn(err);
		self.user = new models.User(res);
		self.organizations = res.organizations;
		var org = self.org = res.organizations[0].id;
		wamp.call(PREFIX + 'organizations/get_organization', org, loadOrg);
	}
	function loadOrg(err, res) {
		if (err)
			return fn(err);
		var org = self.org;
		self.users = res.users.map(function (user) {
			return models.User.get(user.id) || new models.User(user);
		});
		self.rooms = res.rooms.map(function (room) {
			return self._bindRoom(room);
		});
		wamp.call(PREFIX + 'organizations/join', org, function (err) {
			if (err)
				return fn(err);
			fn(undefined, self);
		});
	}
};

/**
 * Creates the room object, and also binds the message handler
 */
App.prototype._bindRoom = function App__bindRoom(room) {
	// FIXME: org handling
	var org = this.org;
	room = new models.Room(room);
	var uri = [PREFIX + 'organization', org, 'room', room.id].join('/');
	// subscribe to new chat lines:
	this.wamp.subscribe(uri + '#message', function (message) {
		message.user = models.User.get(message.user);
		var line = new models.Line(message);
		// FIXME: this should be better
		room._lines[line.id] = line;
		room.history.push(line);
	});
	// subscribe to reading notifications:
	this.wamp.subscribe(uri + '#reading', function (msg) {
		// TODO: clean this up!
		var last = room._readingStatus[msg.user];
		var user = models.User.get(msg.user);
		// remove the user from the last lines readers
		if (last) {
			var i = last.readers.indexOf(user);
			last.readers.splice(i, 1);
		}
		// and add it to the new line
		var line = room._lines[msg.line];
		line.readers.push(user);
		room._readingStatus[msg.user] = line;
	});
	return room;
};

App.prototype.publish = function App_publish(room, msg, fn) {
	fn = fn || function () {};
	this.wamp.call(PREFIX + 'rooms/post', room.id, msg, fn);
};

// FIXME: not hooked up yet serverside, test with:
// wamp._handle('[8, "http://domain/organization/1/room/10#reading", {"user": 1, "line": 0}]');
App.prototype.read = function App_read(room, line) {
	var uri = [PREFIX + 'organization', this.org, 'room', room].join('/');
	this.wamp.publish(uri + '#reading', {line: line});
};
