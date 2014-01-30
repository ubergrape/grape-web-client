/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Wamp = require('wamp1');
var WebSocketBuffering = require('websocket-buffering');
var array = require('array');

var models = exports.models = {
	Room: require('./models/room'),
	User: require('./models/user'),
	Line: require('./models/chatline'),
	Organization: require('./models/organization'),
};

exports.App = App;

function App(options, fn) {
	options = options || {};

	// the currently signed in user
	this.user = undefined;
	// list of all the organizations the user belongs to
	this.organizations = undefined;

	// the currently active organization
	this.organization = undefined;

	this.init(options, fn);
}

var PREFIX = 'http://domain/';

/**
 * Initializes the connection and gets all the user profile and organization
 * details and joins the first one.
 */
App.prototype.init = function App_init(options, fn) {
	this.wamp = new Wamp(new WebSocketBuffering(options.websocket));
	var self = this;
	self.wamp.call(PREFIX + 'users/get_profile', function (err, res) {
		if (err)
			return fn(err);
		self.user = new models.User(res);
		self.organizations = array(res.organizations.map(function (o) {
			return new models.Organization(o);
		}));
		fn(undefined, self);
	});
};

/**
 * This sets the current active organization. It also joins it and loads the
 * organization details such as the users and rooms.
 */
App.prototype.setOrganization = function App_setOrganization(org, fn) {
	var self = this;
	this.organization = org;
	join();

	function join() {
		// subscribe to user status changes
		self.wamp.subscribe(PREFIX + 'organization/' + org.id + '#status', function (status) {
			var user = models.User.get(status.user);
			user.status = status.status;
		});
		self.wamp.call(PREFIX + 'organizations/join', org.id, function (err) {
			if (err)
				return fn(err);
			load();
		});
	}
	function load() {
		self.wamp.call(PREFIX + 'organizations/get_organization', org.id, function (err, res) {
			if (err)
				return fn(err);
			org.users = res.users.map(function (u) {
				var user = models.User.get(u.id) || new models.User(u);
				user.status = u.status;
				return user;
			});
			org.rooms = res.rooms.map(function (room) {
				room.users = room.users.map(function (u) {
					return models.User.get(u);
				});
				room.joined = !!~room.users.indexOf(self.user);
				room = new models.Room(room);
				return room;
			});
			fn(undefined, org);
		});
	}
};

/**
 * Subscribes to the rooms
 */
App.prototype.subscribeRoom = function App_subscribeRoom(room) {
	var org = this.organization.id;
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
	var uri = [PREFIX + 'organization', this.organization.id, 'room', room.id].join('/');
	this.wamp.publish(uri + '#reading', {line: line.id});
};
