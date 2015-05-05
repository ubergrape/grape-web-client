/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Wamp = require('wamp1');
var WebSocket = require('websocket');
var array = require('array');
var Emitter = require('emitter');

var exports = module.exports = App;

var models = exports.models = {
	Room: require('./models/room'),
	User: require('./models/user'),
	Line: require('./models/chatline'),
	Organization: require('./models/organization'),
};

exports.constants = require('./constants');

var PREFIX = 'http://domain/';
var HEARTBEAT_INTERVAL = 10000;
var HEARTBEAT_TIMEOUT = 10000;

function App() {
	Emitter.call(this);

	var self = this;
	// Will be defined from .connect()
	this.uri = undefined;
	// the currently signed in user
	this.user = undefined;
	// user settings
	this.settings = undefined;
	// list of all the organizations the user belongs to
	this.organizations = undefined;
	// the currently active organization
	this.organization = undefined;
	// "reconnected" should reflect if this is the first initial
	// connection or there have been reconnect attempts
	this.reconnected = false;
	this.reconnecting = false;
	this.connected = false;
	this.connecting = false;

	this._typing_timeouts = [];
}

App.prototype = Object.create(Emitter.prototype);

App.prototype.startHeartbeat = function() {
	var self = this;
	this._heartbeat = setInterval(function() {
		self.heartbeat(self);
	}, HEARTBEAT_INTERVAL);
};

App.prototype.stopHeartbeat = function () {
	clearInterval(this._heartbeat);
};

App.prototype.logTraffic = function App_logTraffic() {
	var socket = this.wamp.socket;
	var send = socket.send;
	socket.send = function (msg) {
		console.log('sending', tryJSON(msg));
		send.call(socket, msg);
	};
	socket.on('message', function (msg) {
		console.log('received', tryJSON(msg));
	});
	function tryJSON(msg) {
		try {
			return JSON.parse(msg);
		} catch(e) {}
		return msg;
	}
};

App.prototype.heartbeat = function App_heartbeat(app) {
	if (!app.connected)
		return;
	var heartbeatTimeout = setTimeout(function() {
			console.log("NO PONG");
			app.onDisconnect();
	}, HEARTBEAT_TIMEOUT);
	this.wamp.call(PREFIX + 'ping', function(err, res) {
		if (res === 'pong') {
			clearTimeout(heartbeatTimeout);
		}
	});
};

App.prototype.onDisconnect = function App_ondisconnect() {
	if (this.connected) {
		this.stopHeartbeat();
		if (this._ws) {
			this.unbind();
			this._ws.close(3001);
		}
		this.connected = false;
		this.emit('disconnected', this._ws);
	}
	this.reconnect();
};
/**
 * Initializes the connection and gets all the user profile and organization
 * details and joins the first one.
 *
 * @param {WebSocket|String} WebSocket is used for testing only, uri is provided
 * only when first time.
 * @param {Function} [callback]
 */
App.prototype.connect = function App_connect(ws, callback) {
	// Legacy callback, used in mobile_history.html
	if (callback) this.once('connected', callback);

	if (this.connecting) return;

	var self = this;
	this.connecting = true;

	// Its an URI string passed first time when connecting.
	if (typeof ws === 'string') {
		this.uri = ws;
		ws = null;
	}

	if (!ws) ws = new WebSocket(this.uri);

	this._ws = ws;

	ws.on('open', function() {
		console.log("Websocket Connection opened!");
		self.wamp = new Wamp(ws, {
			omitSubscribe: true
		});
		self.bindEvents();
		self.wamp.call(PREFIX + 'users/get_profile', function (err, res) {
			if (err) return self.emit('error', err);
			self.user = new models.User(res);
			self.settings = self.user.settings;
			self.organizations = array(res.organizations.map(function (o) {
				return new models.Organization(o);
			}));
			self.emit('change user', self.user);
			self.emit('change settings', self.settings);
			self.emit('change organizations', self.organizations);
			self.connected = true;
			self.connecting = false;
			self.emit('connected', self.reconnected, self._ws);
			self.startHeartbeat();
			console.log(self.reconnected ? 'Reconnected!' : 'Connected!');
		});
	});
	ws.on('close', function(e) {
		self.connecting = false;
		console.log("Websocket Closed, disconnecting!", e);
		self.onDisconnect();
	});
	ws.on('error', function(err) {
		self.connecting = false;
		console.log("Websocket Error, disconnecting!", arguments);
		self.onDisconnect();
	});
};

App.prototype.reconnect = function App_reconnect() {
	if (this.reconnecting) return;
	this.reconnecting = true;
	var self = this;
	var timeout = Math.floor((Math.random() * 5000) + 1);
	console.log("Attempting reconnect in ms:", timeout);
	setTimeout(function() {
		try {
			console.log('Trying to reconnect now!');
			self.reconnected = true;
			self.connect();
		} catch (e) {
			console.log("Reconnect failed:", e);
		}
		self.reconnecting = false;
	}, timeout);
};

App.prototype.bindEvents = function App_bindEvents() {
	var self = this;
	var wamp = this.wamp;
	function dump(name) {
		return function (data) {console.log('FIXME: '+ name, data);};
	}
	// channel events
	wamp.subscribe(PREFIX + 'channel#new', function (data) {
		self._tryAddRoom(data.channel);
		self.emit('newroom');
	});
	wamp.subscribe(PREFIX + 'channel#updated', function (data) {
		var room = models.Room.get(data.channel.id);
		room.name = data.channel.name;
		room.slug = data.channel.slug;
		self.emit('channelupdate', room);
	});
	wamp.subscribe(PREFIX + 'channel#removed', function(data) {
		var room = models.Room.get(data.channel);
		var index = self.organization.rooms.indexOf(room);
		if (~index)
			self.organization.rooms.splice(index, 1);
		self.emit('roomdeleted', room);
	});
	wamp.subscribe(PREFIX + 'channel#typing', function (data) {
		var user = models.User.get(data.user);
		if (user === self.user) {
			return
		}
		var room = models.Room.get(data.channel);
		var index = room.typing.indexOf(user);

		// there might still be a timeout for this user if the user stops
		// typing and starts typing within one second.
		// there can also be a 10 second safety timeout.
		// we can safely clear a timeout that doesn't exist, so no checks here
		clearTimeout(self._typing_timeouts[room.id + "_" + user.id]);

		if (data.typing && !~index) {
			room.typing.push(user);
			trigger();
			// the typing notification should be removed after 10 seconds
			// automatically because the user might kill the connection and we
			// would never receive a `typing: false` event
			self._typing_timeouts[room.id + "_" + user.id] = setTimeout(function(){
				room.typing.splice(index, 1);
				trigger();
			}, 10000);
		} else if (!data.typing && ~index) {
			// we want the typing notification to be displayed at least five
			// seconds
			self._typing_timeouts[room.id + "_" + user.id] = setTimeout(function(){
				room.typing.splice(index, 1);
				trigger();
			}, 5000);
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
		if (!line) return; // ignore read notifications for messages we don’t have
		var room = line.channel;
		// ignore this for the current user, we track somewhere else
		if (user === self.user) return self.emit('channelRead', line);
		var last = room._readingStatus[data.user];
		// remove the user from the last lines readers
		if (last) {
			var i = last.readers.indexOf(user);
			last.readers.splice(i, 1);
		}
		// and add it to the new line
		room._readingStatus[data.user] = line;
		line.readers.push(user);
	});
	wamp.subscribe(PREFIX + 'channel#joined', function (data) {
		var user = models.User.get(data.user);
		var room = models.Room.get(data.channel);
		if (!~room.users.indexOf(user)) {
			room.users.push(user);
			self.emit('newRoomMember', room);
		}
	});
	wamp.subscribe(PREFIX + 'channel#left', function (data) {
		var user = models.User.get(data.user);
		var room = models.Room.get(data.channel);
		var index = room.users.indexOf(user);
		if (~index) {
			room.users.splice(index, 1);
			self.emit('memberLeftChannel', room);
		}
	});

	// organization events
	wamp.subscribe(PREFIX + "organization#joined", function (data) {
		// make sure the user doesnt exist yet in the client
		var user = models.User.get(data.user.id);
		if (!user)
			user = new models.User(data.user);
		// make sure we're joining the right organization
		// and the user isnt in there yet
		if (data.organization===self.organization.id &&
			  !~self.organization.users.indexOf(user)) {
			user.active = true;
			user.status = 0;
			user.pm = null;
			self.organization.users.push(user);
			self.emit('new org member', user);
		}
	});
	wamp.subscribe(PREFIX + 'organization#left', function (data) {
		var user = models.User.get(data.user);
		var index = self.organization.users.indexOf(user);
		if (user && ~index && data.organization===self.organization.id) {
			var inactivePm = false;
			self.organization.users.forEach(function(user) {
				if (user.id === data.user
				&& (!user.pm || user.pm && user.pm.history.length === 0)) {
					inactivePm = user;
				}
			});
			if (inactivePm) {
				var inactivePmIndex = self.organization.pms.indexOf(inactivePm);
				self.organization.pms.splice(inactivePmIndex, 1);
				self.emit('deleteduser', user);
			}
			user.active = false;
		}
	});

	// message events
	wamp.subscribe(PREFIX + 'message#new', function (data) {
		data.read = false;
		var line = new models.Line(data);
		var room = models.Room.get(data.channel);
		room.unread++;
		room.history.push(line);
		// users message and everything before that is read
		if (line.author === self.user)
			self.setRead(room, line);
		self.emit('newmessage', line);
	});
	wamp.subscribe(PREFIX + 'message#updated', function(data) {
		var msg = models.Line.get(data['id']);
		// right now only text can be updated
		msg.text = data.text;
		var ch = models.Room.get(data['channel']);
		var idx = ch.history.indexOf(msg);
		if (~idx)
			ch.history.splice(idx, 1, msg);
	});
	wamp.subscribe(PREFIX + 'message#removed', function(data) {
		var msg = models.Line.get(data['id']);
		var ch = models.Room.get(data['channel']);
		var idx = ch.history.indexOf(msg);
		if (~idx)
			ch.history.splice(idx, 1);
	});

	// user events
	wamp.subscribe(PREFIX + 'user#status', function (data) {
		var user = models.User.get(data.user);
		user.status = data.status;
		self.emit('change user', user);
	});
	wamp.subscribe(PREFIX + 'user#mentioned', function (data) {
		if (data.message.organization !== self.organization.id) return;
		var msg = new models.Line(data.message);
		msg.channel.mentioned++;
	});
	wamp.subscribe(PREFIX + 'user#updated', function (data) {
		var user = models.User.get(data.user.id);
		user.username = data.user.username;
		user.firstName = data.user.firstName;
		user.lastName = data.user.lastName;
		user.displayName = data.user.displayName;
		if (data.user.avatar !== null) {
			user.avatar = data.user.avatar;
		}
		self.emit('change user', user);
	});
	wamp.subscribe(PREFIX + 'notification#new', function (notification) {
		var msg = models.Line.get(notification.message_id);
		if (msg) self.emit('newNotification', msg);
	});
};

App.prototype.unbind = function App__unbind() {
	if (this._ws) this._ws.off();
	// our wamp implementation has no off() right now
	// so we do some hacking
	if (this.wamp) this.wamp._listeners = {};
};

var unknownUser = {
	username: "unknown",
	firstName: "unknown",
	lastName: "User"
};

App.prototype._newRoom = function App__newRoom(room) {
	room.users = room.users.map(function (u) {
		// if the user was not in the models array for some reason
		// create an unknown user so the room loads correctly
		return models.User.get(u) || new models.User(unknownUser);
	});
	var selfindex = room.users.indexOf(this.user);
	room.joined = !!~selfindex;
	// the user MUST NOT be the first in the list
	if (selfindex === 0)
		room.users.push(room.users.shift());
	room = new models.Room(room);

	// defaults
	if (typeof room.unread === "undefined") {
		room.unread = 0;
	}
	room.typing = [];

	return room;
};

App.prototype._tryAddRoom = function App__tryAddRoom(room) {
	var gotroom = models.Room.get(room.id);
	if (gotroom) return gotroom;
	room = this._newRoom(room);
	if (room.type === 'room') {
		this.organization.rooms.push(room);
	} else {
		this.organization.pms.push(room);
	}
	// TODO: this should maybe be handled in the pm model
	if (room.type === 'pm') {
		room.users[0].pm = room;
	}
	return room;
};

/**
 * This sets the current active organization. It also joins it and loads the
 * organization details such as the users and rooms.
 */
App.prototype.setOrganization = function App_setOrganization(org, callback) {
	callback = callback || function() {};
	var self = this;
	// TODO: this should also leave any old organization

	// first get the details
	self.wamp.call(PREFIX + 'organizations/get_organization', org.id, function (err, res) {
		if (err) return self.emit('error', err);
		org.users = res.users.map(function (u) {
			var user = models.User.get(u.id) || new models.User(u);
			user.status = u.status;
			return user;
		});

		var rooms = res.channels.map(self._newRoom.bind(self));
		org.rooms = rooms.filter(function (r) { return r.type === 'room'; });
		org.pms = rooms.filter(function (r) { return r.type === 'pm'; });
		if (res.logo !== null) org.logo = res.logo;
		if (res.custom_emojis !== null) org.custom_emojis = res.custom_emojis;
		if (res.has_integrations !== null) org.has_integrations = res.has_integrations;

		// connect users and pms
		org.pms.forEach( function(pm) { pm.users[0].pm = pm; });

		// then join
		self.wamp.call(PREFIX + 'organizations/join', org.id, function (err) {
			if (err) return self.emit('error', err);
			self.organization = org;
			// put role in user object for consistency with other user objects
			self.user.role = self.organization.role;
			self.emit('change organization', org);
			callback();
		});
	});
};

App.prototype.endedIntro = function App_endedIntro() {
	this.wamp.call(PREFIX + 'users/set_profile', {'show_intro': false});
};

App.prototype.changedTimezone = function App_changedTimezone(tz) {
	this.wamp.call(PREFIX + 'users/set_profile', {'timezone': tz});
};

App.prototype.openPM = function App_openPM(user, callback) {
	callback = callback || function() {};
	var self = this;
	this.wamp.call(PREFIX + 'pm/open', this.organization.id, user.id, function (err, pm) {
		if (err) return self.emit('error', err);
		pm = self._newRoom(pm);
		self.organization.pms.push(pm);
		user.pm = pm;
		callback();
	});
};

App.prototype.createRoom = function App_createRoom(room) {
	room.organization = this.organization.id;
	var self = this;
	this.wamp.call(PREFIX + 'rooms/create', room, function (err, room) {
		if (err) return self.emit('roomcreateerror', err.details);
		self.emit('roomcreated', self._tryAddRoom(room));
	});
};

App.prototype.deleteRoom = function App_deleteRoom(room, roomName, callback) {
	room.organization = this.organization.id;
	var self = this;
	this.wamp.call(PREFIX + 'channels/delete', room.id, roomName, function (err, result) {
		if (callback !== undefined) {
			callback(err, result);
		}
	});
};

App.prototype.joinRoom = function App_joinRoom(room, callback) {
	var self = this;
	if (room.joined) return;
	this.wamp.call(PREFIX + 'channels/join', room.id, function (err) {
		if (err) return self.emit('error', err);
		room.joined = true;
		self.emit('joinedChannel');
		if (callback !== undefined) callback();
	});
};

App.prototype.leaveRoom = function App_leaveRoom(roomID) {
	var self = this;
	var room = models.Room.get(roomID);
	if (!room.joined) return;
	this.wamp.call(PREFIX + 'channels/leave', room.id, function (err) {
		if (err) return self.emit('error', err);
		room.joined = false;
		self.emit('leftChannel', room);
	});
};

App.prototype.renameRoom = function App_renameRoom(roomID, newName) {
	var emit = this.emit.bind(this);
	this.wamp.call(PREFIX + 'rooms/rename', roomID, newName, function(err) {
		if (err) emit('roomrenameerror', err);
	});
}

App.prototype.onSetNotificationsSession = function App_onSetNotificationsSession (orgID) {
	this.wamp.call(PREFIX + 'notifications/set_notification_session', orgID);
};

App.prototype.autocomplete = function App_autocomplete(text, callback) {
	this.wamp.call(
		PREFIX + 'search/autocomplete',
		text,
		this.organization.id,
		true,
		function (err, result) {
			if (callback !== undefined) {
				callback(err, result);
			}

		}
	);
};

App.prototype.autocompleteDate = function App_autocompleteDate(text, callback) {
	this.wamp.call(PREFIX + 'search/autocomplete_date', text, this.organization.id,
			function (err, result) {
			if (callback !== undefined) {
				callback(err, result);
			}

	});
};

App.prototype.search = function App_search(text) {
	var self = this;
	this.wamp.call(PREFIX + 'search/search', text, this.organization.id,
			function (err, results) {
			var r = [];
			var lines = results.results.map(function(l) {
				if(l.index !== 'objects_alias') {
					l = new models.Line(l);
					r.unshift(l);
				} else {
					r.unshift(l);
				}
			});
			var f = [];
			//console.log(results.facets);
			//var facets = results.facets.map(function(facet) {
				//console.log(facet);
			//});
			self.emit('gotsearchresults', {
				'results': r,
				'facets': f,
				'total': results.total,
				'q': results.q
			});
		});
};

App.prototype.inviteToRoom = function App_inviteToRoom(room, users, callback) {
	this.wamp.call(PREFIX + 'channels/invite', room.id, users, function(err, result) {
		if (callback !== undefined) {
			callback(err, result);
		}
	});
};

/**
 * Loads history for `room`
 */
App.prototype.getHistory = function App_getHistory(room, options) {
	var self = this;
	options = options || {};
	this.wamp.call(PREFIX + 'channels/get_history', room.id, options, function (err, res) {
		if (err) return self.emit('error', err);
		// so when the first message in history is read, assume the history as read
		// as well
		var read = !!room.history.length && room.history[0].read;
		if (res.length === 0) return self.emit('nohistory');
		// append all to the front of the array
		// TODO: for now the results are sorted in reverse order, will this be
		// consistent?
		var lines = res.map(function (line) {
			// check if line already exists and only add it to the history
			// if it isnt in the history yet
			var exists = models.Line.get(line.id);
			if (!exists || !~room.history.indexOf(exists)) {
				line.read = read;
				line = new models.Line(line);
				// TODO: maybe check if everythings correctly sorted before
				// inserting the line?
				room.history.unshift(line);
			}
		});
		self.emit('gothistory');
	});
};

App.prototype.setRead = function App_setRead(room, line) {
	// update the unread count
	// iterate the history in reverse order
	// (its more likely the read line is at the end)
	room.mentioned = 0;
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
	// TODO: emit error?
	this.wamp.call(PREFIX + 'channels/read', room.id, line.id);
};

App.prototype.setTyping = function App_setTyping(room, typing) {
	// TODO: emit error?
	this.wamp.call(PREFIX + 'channels/set_typing', room.id, typing);
};

App.prototype.deleteMessage = function App_deleteMessage(ch, msgId) {
	this.wamp.call(PREFIX + 'channels/delete_message', ch['id'], msgId);
};

App.prototype.publish = function App_publish(room, msg, options) {
	var self = this;
	this.wamp.call(PREFIX + 'channels/post', room.id, msg, options, function (err) {
		if (err) return self.emit('error', err);
	});
};

App.prototype.updateMsg = function App_updateMessage(msg, text) {
	this.wamp.call(PREFIX + 'channels/update_message', msg['channel'].id, msg['id'], text, function (err) {

	});
};
