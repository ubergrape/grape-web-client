/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Wamp = require('wamp1');
var WebSocketBuffering = require('websocket-buffering');
var array = require('array');

var exports = module.exports = App;

var models = exports.models = {
	Room: require('./models/room'),
	User: require('./models/user'),
	Line: require('./models/chatline'),
	Organization: require('./models/organization'),
};

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
	var ws = options.websocket;
	if (typeof ws === 'string')
		ws = new WebSocketBuffering(options.websocket);
	this.wamp = new Wamp(ws, {
		omitSubscribe: true
	});
	this.bindEvents();
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

App.prototype.bindEvents = function App_bindEvents() {
	var self = this;
	var wamp = this.wamp;
	function dump(name) {
		return function (data) {console.log('FIXME: '+ name, data);};
	}
	// channel events
	wamp.subscribe(PREFIX + 'channel#new', function (data) {
		dump('channel#new')(data);
		var room = new models.Room(data.room);
		// TODO: better org handling?
		self.organization.rooms.push(room);
	});
	wamp.subscribe(PREFIX + 'channel#updated', function (data) {
		var room = models.Room.get(data.room.id);
		room.name = data.room.name;
		room.slug = data.room.slug;
	});
	wamp.subscribe(PREFIX + 'channel#removed', dump('channel#removed'));
	wamp.subscribe(PREFIX + 'channel#typing', function (data) {
		var room = models.Room.get(data.channel);
		//var user = models.User.get(msg.user);
		if (data.typing && !room.typing[data.user]) {
			room.typing[data.user] = true;
			trigger();
		} else if (!data.typing && room.typing[data.user]) {
			delete room.typing[data.user];
			trigger();
		}
		function trigger() {
			// FIXME: model needs an api to do this:
			var name = 'typing';
			room._model.emit('change', room, name);
			room._model.emit('change ' + name, room);
			room.emit('change', name);
			room.emit('change ' + name);
		}
	});
	wamp.subscribe(PREFIX + 'channel#read', function (data) {
		var user = models.User.get(data.user);
		var line = models.Line.get(data.message);
		var room = models.Room.get(line.channel);
		// ignore this for the current user, we track somewhere else
		if (user === self.user)
			return;
		var last = room._readingStatus[data.user];
		// remove the user from the last lines readers
		if (last) {
			var i = last.readers.indexOf(user);
			last.readers.splice(i, 1);
		}
		// and add it to the new line
		line.readers.push(user);
		room._readingStatus[data.user] = line;
	});
	wamp.subscribe(PREFIX + 'channel#joined', function (data) {
		var user = models.User.get(data.user);
		var room = models.Room.get(data.channel);
		if (!~room.users.indexOf(user))
			room.users.push(user);
	});
	wamp.subscribe(PREFIX + 'channel#left', function (data) {
		var user = models.User.get(data.user);
		var room = models.Room.get(data.channel);
		var index = room.users.indexOf(user);
		if (~index)
			room.users.splice(index, 1);
	});

	// message events
	wamp.subscribe(PREFIX + 'message#new', function (data) {
		var room = models.Room.get(data.channel);
		data.user = data.author;
		data.read = false;
		var line = new models.Line(data);
		room.unread++;
		room.history.push(line);
	});
	wamp.subscribe(PREFIX + 'message#updated', dump);
	wamp.subscribe(PREFIX + 'message#removed', dump);

	// user events
	wamp.subscribe(PREFIX + 'user#status', function (data) {
		var user = models.User.get(data.user);
		user.status = data.status;
	});
	wamp.subscribe(PREFIX + 'user#updated', function (data) {
		var user = models.User.get(data.user.id);
		user.username = data.user.username;
		user.firstName = data.user.firstName;
		user.lastName = data.user.lastName;
	});
};

/**
 * This sets the current active organization. It also joins it and loads the
 * organization details such as the users and rooms.
 */
App.prototype.setOrganization = function App_setOrganization(org, fn) {
	var self = this;
	this.organization = org;

	// TODO: this should also leave any old organization

	self.wamp.call(PREFIX + 'organizations/join', org.id, function (err) {
		if (err)
			return fn(err);
		load();
	});

	function load() {
		self.wamp.call(PREFIX + 'organizations/get_organization', org.id, function (err, res) {
			if (err)
				return fn(err);
			org.users = res.users.map(function (u) {
				var user = models.User.get(u.id) || new models.User(u);
				user.status = u.status;
				return user;
			});
			org.rooms = res.channels.map(function (room) {
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

App.prototype.joinRoom = function App_joinRoom(room, fn) {
	fn = fn || function () {};
	if (room.joined)
		return fn(undefined, null);
	this.wamp.call(PREFIX + 'channels/join', room.id, function (err, res) {
		if (err)
			return fn(err);
		room.joined = true;
		fn(err, res);
	});
};
App.prototype.leaveRoom = function App_leaveRoom(room, fn) {
	fn = fn || function () {};
	if (!room.joined)
		return fn(undefined, null);
	this.wamp.call(PREFIX + 'channels/leave', room.id, function (err, res) {
		if (err)
			return fn(err);
		room.joined = false;
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
	this.wamp.call(PREFIX + 'channels/get_history', room.id, options, function (err, res) {
		// so when the first message in history is read, assume the history as read
		// as well
		var read = !!room.history.length && room.history[0].read;
		// append all to the front of the array
		// TODO: for now the results are sorted in reverse order, will this be
		// consistent?
		var lines = res.map(function (line) {
			line.user = line.author;
			line.read = read;
			line = new models.Line(line);
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
		if (l.read)
			break;
		if (l === line) {
			setread = true;
			room.unread = room.history.length - i - 1;
		}
		if (setread)
			l.read = true;
	}
	if (!setread)
		return;
	// and notify the server
	this.wamp.call(PREFIX + 'channels/read', room.id, line.id);
};

App.prototype.setTyping = function App_setTyping(room, typing) {
	this.wamp.call(PREFIX + 'channels/set_typing', room.id, typing);
};

App.prototype.publish = function App_publish(room, msg, fn) {
	fn = fn || function () {};
	this.wamp.call(PREFIX + 'channels/post', room.id, msg, fn);
};

