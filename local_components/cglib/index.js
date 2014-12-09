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
var HEARTBEAT_TIMEOUT = 3000;

function App() {
	Emitter.call(this);

	var self = this;
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
	this.connected = false;
	this.reconnecting = false;
}

App.prototype = Object.create(Emitter.prototype);

App.prototype.startHeartbeat = function() {
	var self = this;
	this._heartbeat = setInterval(function() {
		self.heartbeat(self);
	}, HEARTBEAT_INTERVAL);
  console.log("Heartbeat started...");
};

App.prototype.stopHeartbeat = function () {
	clearInterval(this._heartbeat);
  console.log("Heartbeat stopped...");
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
	console.log("Send heartbeat...");
	var heartbeatTimeout = setTimeout(function() {
			console.log("NO PONG");
			app.onDisconnect();
	}, HEARTBEAT_TIMEOUT);
	this.wamp.call(PREFIX + 'ping', function(err, res) {
		if (res === 'pong') {
			console.log('received', res);
			clearTimeout(heartbeatTimeout);
		}
	});
};

App.prototype.onDisconnect = function App_ondisconnect() {
	if (this.connected) {
		this.stopHeartbeat();
		if (this.ws) {
			this.unbind();
			this.ws.close(3001);
		}
		this.connected = false;
		this.emit('disconnected', this.ws);
	}
	this.reconnect();
};
/**
 * Initializes the connection and gets all the user profile and organization
 * details and joins the first one.
 */
App.prototype.connect = function App_connect(ws) {
	var self = this;
	this._ws = ws;
	if (typeof ws === 'string')
		ws = new WebSocket(ws);
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
			self.emit('connected', self.reconnected, self.ws);
			self.startHeartbeat();
			console.log(self.reconnected ? 'Reconnected!' : 'Connected!');
		});
	});
	ws.on('close', function(e) {
		console.log("Websocket Closed, disconnecting!", e);
		self.onDisconnect();
	});
	ws.on('error', function(err) {
		console.log("Websocket Error, disconnecting!", arguments);
		self.onDisconnect();
	});
	this.ws = ws;
	// this is really ugly but needed for the tests to run
	if (typeof this.ws._openForTest !== "undefined") this.ws._openForTest();
};

App.prototype.reconnect = function App_reconnect(ws) {
	if (this.reconnecting)
		return;
	this.reconnecting = true;
	var self = this;
	var timeout = Math.floor((Math.random() * 5000) + 1);
	if (this.ws)
		delete this.ws;
	console.log("Attempting reconnect in ms:", timeout);
	setTimeout(function() {
		try {
			console.log('Trying to reconnect now!');
			self.reconnected = true;
			self.connect(self._ws);
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
	});
	wamp.subscribe(PREFIX + 'channel#updated', function (data) {
		var room = models.Room.get(data.channel.id);
		room.name = data.channel.name;
		room.slug = data.channel.slug;
	});
	wamp.subscribe(PREFIX + 'channel#removed', function(data) {
		var room = models.Room.get(data.channel);
		var index = self.organization.rooms.indexOf(room);
		if (~index)
			self.organization.rooms.splice(index, 1);
		self.emit('roomdeleted', room);
	});
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
		if (!line) return; // ignore read notifications for messages we don’t have
		var room = line.channel;
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
		room._readingStatus[data.user] = line;
		line.readers.push(user);
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

	// organization events
	wamp.subscribe(PREFIX + "organization#joined", function (data) {
		// make sure the user doesnt exist yet in the client
		var user = models.User.get(data.user.id);
		if (!user)
			user = new models.User(data.user);
		// make sure we're joining the right organization
		// and the user isnt in there yet
		if (data.organization===self.organization.id &&
			  !~self.organization.users.indexOf(user))
			self.organization.users.push(user);
	});
	wamp.subscribe(PREFIX + 'organization#left', function (data) {
		var user = models.User.get(data.user);
		var index = self.organization.users.indexOf(user);
		if (user && ~index && data.organization===self.organization.id)
			self.organization.users.splice(index, 1);
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
		if (data.user.avatar != null) {
			user.avatar = data.user.avatar;
		}
		self.emit('change user', self.user);
	});
};

App.prototype.unbind = function App__unbind() {
	if (this.ws) this.ws.off();
	// our wamp implementation has no off() right now
	// so we do some hacking
	if (this.wamp) this.wamp._listeners = {};
};

App.prototype._newRoom = function App__newRoom(room) {
	room.users = room.users.map(function (u) {
		return models.User.get(u);
	});
	var selfindex = room.users.indexOf(this.user);
	room.joined = !!~selfindex;
	// the user MUST NOT be the first in the list
	if (selfindex === 0)
		room.users.push(room.users.shift());
	room = new models.Room(room);

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
	return room;
};
/**
 * This sets the current active organization. It also joins it and loads the
 * organization details such as the users and rooms.
 */
App.prototype.setOrganization = function App_setOrganization(org) {
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
		res.invited_users.map(function (u) {
			var user = models.User.get(u.id) || new models.User(u);
			user.status = u.status;
			org.users.push(user);
		});
		var rooms = res.channels.map(self._newRoom.bind(self));
		org.rooms = rooms.filter(function (r) { return r.type === 'room'; });

		org.pms = rooms.filter(function (r) { return r.type === 'pm'; });
		if (res.logo != null) {
            org.logo = res.logo;
        }
        if (res.custom_emojis != null) {
            org.custom_emojis = res.custom_emojis;
        }
        // connect users and pms
        org.users.map(function(u) {
            if (typeof u.pm !== 'undefined') {
                u.pm = models.Room.get(u.pm);
            }
            return u;
        });
		// then join
		self.wamp.call(PREFIX + 'organizations/join', org.id, function (err) {
			if (err) return self.emit('error', err);
			self.organization = org;
			self.emit('change organization', org);
		});
	});
};

App.prototype.endedIntro = function App_endedIntro() {
	this.wamp.call(PREFIX + 'users/set_profile', {'show_intro': false});
};

App.prototype.changedTimezone = function App_changedTimezone(tz) {
	this.wamp.call(PREFIX + 'users/set_profile', {'timezone': tz});
};

App.prototype.openPM = function App_openPM(user) {
	var self = this;
	this.wamp.call(PREFIX + 'pm/open', this.organization.id, user.id, function (err, pm) {
		if (err) return self.emit('error', err);
		pm = self._newRoom(pm);
		self.organization.pms.push(pm);
        user.pm = pm;
	});
};

App.prototype.createRoom = function App_createRoom(room) {
	room.organization = this.organization.id;
	var self = this;
	this.wamp.call(PREFIX + 'rooms/create', room, function (err, room) {
		if (err) return self.emit('roomcreateerror', errorJSON(err));
		self.emit('roomcreated', self._tryAddRoom(room));
	});
};

App.prototype.deleteRoom = function App_deleteRoom(room, password, callback) {
	console.log("trying to delete rooom");
	room.organization = this.organization.id;
	var self = this;
	this.wamp.call(PREFIX + 'channels/delete', room.id, password, function (err, result) {
		if (callback !== undefined) {
			callback(err, result);
		}
	});
};

App.prototype.joinRoom = function App_joinRoom(room) {
	var self = this;
	if (room.joined) return;
	this.wamp.call(PREFIX + 'channels/join', room.id, function (err) {
		if (err) return self.emit('error', err);
		room.joined = true;
	});
};
App.prototype.leaveRoom = function App_leaveRoom(room) {
	var self = this;
	if (!room.joined) return;
	this.wamp.call(PREFIX + 'channels/leave', room.id, function (err) {
		if (err) return self.emit('error', err);
		room.joined = false;
	});
};

App.prototype.autocomplete = function App_autocomplete(text, callback) {
	this.wamp.call(PREFIX + 'search/autocomplete', text, this.organization.id,
			function (err, result) {
			if (callback !== undefined) {
				callback(err, result);
			}

	});
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

function errorJSON(err) {
	if (~err.uri.indexOf('ValidationError'))
		err.details = JSON.parse(err.details);
	return err;
}
