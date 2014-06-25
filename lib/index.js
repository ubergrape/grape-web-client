/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Wamp = require('wamp1');
var WebSocketBuffering = require('websocket-buffering');
var array = require('array');
var Emitter = require('emitter');

var exports = module.exports = App;

var models = exports.models = {
	Room: require('./models/room'),
	User: require('./models/user'),
	Line: require('./models/chatline'),
	Organization: require('./models/organization'),
};

function App() {
	Emitter.call(this);

	var self = this;
	// the currently signed in user
	this.user = undefined;
	// list of all the organizations the user belongs to
	this.organizations = undefined;
	// the currently active organization
	this.organization = undefined;
	// "reconnected" should reflect if this is the first initial
	// connection or there have been reconnect attempts
	this.reconnected = false;
	this.connected = false;
	this._heartbeat = setInterval(function() {
		self.heartbeat(self);
	}, 20000);
}

App.prototype = Object.create(Emitter.prototype);

var PREFIX = 'http://domain/';

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
	if (app.connected) {
		console.log("Send heartbeat...");
		app.wamp._send([99]);
	}
};
/**
 * Initializes the connection and gets all the user profile and organization
 * details and joins the first one.
 */
App.prototype.connect = function App_connect(ws) {
	var self = this;
	var _ws = ws;
	if (typeof ws === 'string')
		ws = new WebSocketBuffering(ws);
	this.wamp = new Wamp(ws, {
		omitSubscribe: true
	});
	ws.on('close', function() {
		self.connected = false;
		self.emit('connection closed', ws);
		self.reconnect(_ws);
	});
	ws.on('error', function(err) {
		console.log('WebSocket Error', err);
	});
	this.bindEvents();
	self.wamp.call(PREFIX + 'users/get_profile', function (err, res) {
		if (err) return self.emit('error', err);
		self.user = new models.User(res);
		self.organizations = array(res.organizations.map(function (o) {
			return new models.Organization(o);
		}));
		self.emit('change user', self.user);
		self.emit('change organizations', self.organizations);
		if (self.reconnected) {
				self.emit('reconnected', ws);
				console.log('Reconnected!');
		}
		self.connected = true;
	});
};

App.prototype.reconnect = function App_reconnect(ws) {
	var self = this;
	var timeout = Math.floor((Math.random() * 5000) + 1);
	console.log("Attempting reconnect in ms:", timeout);
	setTimeout(function() {
		if (self.wamp.socket.readyState ===	self.wamp.socket.CLOSED) {
			// dont try if it's "open" or "opening"
			try {
				console.log('Trying to reconnect now!');
				self.reconnected = true;
				self.connect(ws);
			} catch (e) {
				console.log("Reconnect failed:", e);
			}
		}
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
        })
		var rooms = res.channels.map(self._newRoom.bind(self));
		org.rooms = rooms.filter(function (r) { return r.type === 'room'; });

		org.pms = rooms.filter(function (r) { return r.type === 'pm'; });
		// then join
		self.wamp.call(PREFIX + 'organizations/join', org.id, function (err) {
			if (err) return self.emit('error', err);
			self.organization = org;
			self.emit('change organization', org);
		});
	});
};

App.prototype.openPM = function App_openPM(user) {
	var self = this;
	this.wamp.call(PREFIX + 'pm/open', this.organization.id, user.id, function (err, pm) {
		if (err) return self.emit('error', err);
		pm = self._newRoom(pm);
		self.organization.pms.push(pm);
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

App.prototype.search = function App_search(text) {
	var self = this;
	this.wamp.call(PREFIX + 'search/search', text, this.organization.id,
			function (err, results) {
			var r = [];
			var lines = results.results.map(function(l) {
				if(l.index !== 'objects') {
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
		// append all to the front of the array
		// TODO: for now the results are sorted in reverse order, will this be
		// consistent?
		var lines = res.map(function (line) {
			line.read = read;
			line = new models.Line(line);
			room.history.unshift(line);
		});
		self.emit('gothistory', room, lines);
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
	this.wamp.call(PREFIX + 'channels/update_message', msg['channel'], msg['id'], text, function (err) {

	});
};

function errorJSON(err) {
	if (~err.uri.indexOf('ValidationError'))
		err.details = JSON.parse(err.details);
	return err;
}
