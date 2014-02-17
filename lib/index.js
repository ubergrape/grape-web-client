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
	this.wamp = new Wamp(new WebSocketBuffering(options.websocket), {
		omitSubscribe: true
	});
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

	// TODO: this should also leave and unsubscribe from any old organization

	join();

	function join() {
		// subscribe to user status changes
		self.wamp.subscribe(PREFIX + 'organization/' + org.id + '#status', function (status) {
			var user = models.User.get(status.user);
			user.status = status.status;
		});
		// and to user/room updates
		self.wamp.subscribe(PREFIX + 'organization/' + org.id + '#update', function (update) {
			if (update.user) {
				var user = models.User.get(update.user.id);
				user.username = update.user.username;
				user.firstName = update.user.firstName;
				user.lastName = update.user.lastName;
			} else if (update.room) {
				var room = models.Room.get(update.room.id);
				room.name = update.room.name;
				room.slug = update.room.slug;
			}
		});
		// and to room creates
		self.wamp.subscribe(PREFIX + 'organization/' + org.id + '#create', function (create) {
			var room = new models.Room(create.room);
			org.rooms.push(room);
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
				room.unread = 0; // TODO: initialize to zero for now
				room = new models.Room(room);
				return room;
			});
			fn(undefined, org);
		});
	}
};

App.prototype.joinRoom = function App_joinRoom(room, fn) {
	fn = fn || function () {};
	if (room.joined)
		return fn(undefined, null);
	// lets first subscribe
	this.subscribeRoom(room);
	// and then join
	this.wamp.call(PREFIX + 'rooms/join', room.id, function (err, res) {
		if (err)
			return fn(err);
		room.joined = true;
		fn(err, res);
	});
};
App.prototype.leaveRoom = function App_leaveRoom(room, fn) {
	var self = this;
	fn = fn || function () {};
	if (!room.joined)
		return fn(undefined, null);
	this.wamp.call(PREFIX + 'rooms/leave', room.id, function (err, res) {
		if (err)
			return fn(err);
		room.joined = false;
		// and unsubscribe
		self.unsubscribeRoom(room);
		fn(err, res);
	});
};

/**
 * Loads history for `room`
 */
App.prototype.getHistory = function App_getHistory(room, options, fn) {
	if (typeof options === 'function') {
		fn = options;
		options = {};
	}
	options = options || {};
	fn = fn || function () {};
	this.wamp.call(PREFIX + 'rooms/get_history', room.id, options, function (err, res) {
		// append all to the front of the array
		// TODO: for now the results are sorted in reverse order, will this be
		// consistent?
		var lines = res.map(function (line) {
			line.user = line.author;
			line.read = false; // FIXME: assume unread for now
			line = new models.Line(line);
			room.unread++;
			room.history.unshift(line);
		});
		fn(lines);
	});
};

App.prototype.setRead = function App_setRead(room, line) {
	// update the unread count
	// iterate the history in reverse order
	// (its more likely the read line is at the end)
	var setread = false;
	for (var i = room.history.length - 1; i >= 0; i--) {
		var l = room.history[i];
		if (l === line) {
			setread = true;
			room.unread = room.history.length - i - 1;
		}
		if (l.read && setread)
			break;
		if (setread)
			l.read = true;
	}
	// and notify the server
	this.wamp.call(PREFIX + 'rooms/read', room.id, line.id, function () {
		// ignore for now
	});
};

/**
 * Subscribes to all the rooms the user belongs to
 */
App.prototype.subscribeRooms = function App_subscribeRooms() {
	var self = this;
	self.organization.rooms.forEach(function (room) {
		if (room.joined)
			self.subscribeRoom(room);
	});
};

/**
 * Subscribes to a room
 */
App.prototype.subscribeRoom = function App_subscribeRoom(room) {
	var self = this;
	var org = this.organization.id;
	var uri = [PREFIX + 'organization', org, 'room', room.id].join('/');
	// subscribe to new chat lines:
	this.wamp.subscribe(uri + '#message', function (message) {
		message.user = message.author;
		message.read = false;
		var line = new models.Line(message);
		room.unread++;
		room.history.push(line);
	});
	// subscribe to reading notifications:
	this.wamp.subscribe(uri + '#read', function (msg) {
		var user = models.User.get(msg.user);
		// ignore this for the current user, we track somewhere else
		if (user === self.user)
			return;
		var last = room._readingStatus[msg.user];
		// remove the user from the last lines readers
		if (last) {
			var i = last.readers.indexOf(user);
			last.readers.splice(i, 1);
		}
		// and add it to the new line
		var line = models.Line.get(msg.message);
		line.readers.push(user);
		room._readingStatus[msg.user] = line;
	});
	// subscribe to join/leave
	this.wamp.subscribe(uri + '#join', function (message) {
		var user = models.User.get(message.user);
		if (!~room.users.indexOf(user))
			room.users.push(user);
	});
	this.wamp.subscribe(uri + '#leave', function (message) {
		var user = models.User.get(message.user);
		var index = room.users.indexOf(user);
		if (~index)
			room.users.splice(index, 1);
	});
	return room;
};

App.prototype.unsubscribeRoom = function App_unsubscribeRoom(room) {
	var org = this.organization.id;
	var uri = [PREFIX + 'organization', org, 'room', room.id].join('/');
	this.wamp.unsubscribe(uri + '#message');
	this.wamp.unsubscribe(uri + '#reading');
	this.wamp.unsubscribe(uri + '#join');
	this.wamp.unsubscribe(uri + '#leave');
};

App.prototype.publish = function App_publish(room, msg, fn) {
	fn = fn || function () {};
	this.wamp.call(PREFIX + 'rooms/post', room.id, msg, fn);
};

