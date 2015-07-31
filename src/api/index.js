/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
'use strict';

var Wamp = require('wamp1');
var WebSocket = require('websocket');
var LPSocket = require('lpsocket');
var array = require('array');
var Emitter = require('emitter');

var exports = module.exports = API;

var models = exports.models = {
	Room: require('./models/room'),
	User: require('./models/user'),
	Line: require('./models/chatline'),
	Organization: require('./models/organization'),
};

var PREFIX = 'http://domain/';

// Time we wait until we destroy connection and reconect.
var PONG_MAX_WAIT = 15000;

// Time we wait after we got a pong before we send another ping.
var PING_DELAY = 5000;

function API() {
	Emitter.call(this);

	var self = this;
	// Will be defined from .connect()
	this.wsUri = undefined;
	this.lpUri = '/lp/';
	// the currently signed in user
	this.user = undefined;
	// user settings
	this.settings = undefined;
	// list of all the organizations the user belongs to
	this.organizations = undefined;
	// the currently active organization
	this.organization = undefined;

	// Connected here includes that user data is loaded.
	this.connected = false;
	this.connecting = false;
	this.transport = 'lp';

	this._typingTimeouts = [];
}

API.prototype = Object.create(Emitter.prototype);

API.prototype.logTraffic = function API_logTraffic() {
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

API.prototype.heartbeat = function API_heartbeat() {
	if (!this.connected) return;
	var timedout = false;

	var timeoutId = setTimeout(function() {
		console.log('NO PONG');
		timedout = true;
		this.onDisconnect();
	}.bind(this), PONG_MAX_WAIT);

	this.wamp.call(PREFIX + 'ping', function(err, res) {
		// In case we get this callback after we timed out.
		// Reconnect is already started, which will call .heartbeat.
		if (timedout) return;

		if (res === 'pong') clearTimeout(timeoutId);

		setTimeout(this.heartbeat.bind(this), PING_DELAY);
	}.bind(this));
};

API.prototype.onDisconnect = function API_onDisconnect() {
	this.disconnect();
	this.emit('disconnected', this._ws);
	this.reconnect();
};

API.prototype.onConnect = function API_onConnect(data) {
    this.user = new models.User(data);
    this.user.active = true;
    console.log(this.user);
    this.settings = this.user.settings;
    this.organizations = array(data.organizations.map(function (org) {
        return new models.Organization(org);
    }));
    this.connected = true;
    this.connecting = false;
    this.emit('change user', this.user);
    this.emit('change settings', this.settings);
    this.emit('change organizations', this.organizations);
    this.emit('connected');
    console.log('Connected!');
};

/**
 * Initializes the connection and gets all the user profile and organization
 * details and joins the first one.
 *
 * @param {WebSocket|String} WebSocket is used for testing only, uri is provided
 * only when first time.
 * @param {Function} [callback]
 */
API.prototype.initSocket = function API_initSocket(opts) {
	var lp, ws;
	// first try longpolling
	lp = new LPSocket(opts.lpUri);
	lp.connect();
	lp.once('open', function() {
		// try upgrade to websocket
		ws = new WebSocket(opts.wsUri); 
		ws.once('open', function() {
			// websocket upgrade successful. 
			// close longpolling and continue w/ websocket
			// TODO(flo): explicitly kill lp session
			lp.close();
			opts.connected(ws);
		});
		ws.once('error', function() {
			// use longpolling fallback as websocket failed
			opts.connected(lp);
		});
	});
	lp.once('error', function(err) {
		opts.error(err);
	});
};


API.prototype.connect = function API_connect(ws, callback) {
	if (this.connected) return;

	// Legacy callback, used in mobile_history.html
	if (callback) this.once('connected', callback);

	if (this.connecting) return;

	this.connecting = true;
	this.initSocket({
		lpUri: this.lpUri, 
		wsUri: (typeof ws == 'string' && ws !== '') ? ws : this.wsUri,
		connected: function(socket) {
			// connection established; bootstrap client state
			this._socket = socket;
			this.wamp = new Wamp(socket, {omitSubscribe: true});
			this.bindEvents();
			this.wamp.call(PREFIX + 'users/get_profile', function (err, data) {
				if (err) {
					this.emit('error', err);
					this.onDisconnect();
					return;
				}
				this.onConnect(data);
				this.heartbeat();
			}.bind(this));

			socket.on('close', function(e) {
				console.log('Socket closed, disconnecting!', e);
				this.onDisconnect();
			}.bind(this));

			socket.on('error', function(err) {
				console.log('Socket error, disconnecting!', err);
				this.onDisconnect();
			}.bind(this));
		}.bind(this),
		error: function(err) {
			this.reconnect();
		}.bind(this)
	});
};

API.prototype.disconnect = function API_disconnect() {
	// our wamp implementation has no off() right now
	// so we do some hacking
	if (this.wamp) this.wamp._listeners = {};

	if (this._socket) {
		this._socket.off();
		this._socket.close(3001);
	}

	this.connected = false;
	this.connecting = false;
};

API.prototype.reconnect = function API_reconnect() {
	var self = this;
	var timeout = Math.floor((Math.random() * 5000) + 1);
	console.log('Attempting reconnect in ms:', timeout);
	setTimeout(function() {
		this.connect();
	}.bind(this), timeout);
};

API.prototype.bindEvents = function API_bindEvents() {
	var self = this;
	var wamp = this.wamp;
	function dump(name) {
		return function (data) {console.log('FIXME: '+ name, data);};
	}
	// channel events
	wamp.subscribe(PREFIX + 'channel#new', function (data) {
		self._tryAddRoom(data.channel);
		self.emit('newRoom', data.channel);
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
		clearTimeout(self._typingTimeouts[room.id + '_' + user.id]);

		if (data.typing && !~index) {
			room.typing.push(user);
			trigger();
			// the typing notification should be removed after 10 seconds
			// automatically because the user might kill the connection and we
			// would never receive a `typing: false` event
			self._typingTimeouts[room.id + '_' + user.id] = setTimeout(function(){
				room.typing.splice(index, 1);
				trigger();
			}, 10000);
		} else if (!data.typing && ~index) {
			// we want the typing notification to be displayed at least five
			// seconds
			self._typingTimeouts[room.id + '_' + user.id] = setTimeout(function(){
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
		if (~room.users.indexOf(user)) return;
		// if the user joining the room is the visitor,
		// we need to emit the leftChannel event as well
		// to ensure consistent behaviour across clients
		if (user === self.user) {
			room.joined = true;
			self.emit('joinedChannel');
		}
		room.users.push(user);
		self.emit('newRoomMember', room);
	});
	wamp.subscribe(PREFIX + 'channel#left', function (data) {
		var user = models.User.get(data.user);
		var room = models.Room.get(data.channel);
		var index = room.users.indexOf(user);
		if (!~index) return;
		// if the user leaving the room is the visitor,
		// we need to emit the leftChannel event as well
		// to ensure consistent behaviour across clients
		if (user === self.user) {
			room.joined = false;
			self.emit('leftChannel', room);
		}
		room.users.splice(index, 1);
		self.emit('memberLeftChannel', room);
	});

	// organization events
	wamp.subscribe(PREFIX + 'organization#joined', function (data) {
		// make sure the user doesnt exist yet in the client
		var user = models.User.get(data.user.id);
		if (!user) user = new models.User(data.user);
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
				self.emit('userDeleted', user);
			}
			user.active = false;
		}
	});

	// message events
	wamp.subscribe(PREFIX + 'message#new', function (data) {
		data.read = false;
		var line = models.Line.get(data['id']);
		var room = models.Room.get(data.channel);
		if (~room.history.indexOf(line)) return;
		line = new models.Line(data);
		room.unread++;
		room.history.push(line);
		room.latest_message_time = new Date(line.time).getTime();
		// users message and everything before that is read
		if (line.author === self.user) self.setRead(room, line.id);
		self.emit('newMessage', line);
	});
	wamp.subscribe(PREFIX + 'message#updated', function(data) {
		var msg = models.Line.get(data['id']);
		// right now only text can be updated
		msg.text = data.text;
		var ch = models.Room.get(data['channel']);
		var idx = ch.history.indexOf(msg);
		if (~idx) ch.history.splice(idx, 1, msg);
	});
	wamp.subscribe(PREFIX + 'message#removed', function(data) {
		var msg = models.Line.get(data['id']);
		var ch = models.Room.get(data['channel']);
		var idx = ch.history.indexOf(msg);
		if (~idx) ch.history.splice(idx, 1);
	});

	// user events
	wamp.subscribe(PREFIX + 'user#status', function (data) {
		var user = models.User.get(data.user);
		user.status = data.status;
		self.emit('change user', user);
	});
	wamp.subscribe(PREFIX + 'user#mentioned', function (data) {
		if (data.message.organization !== self.organization.id) return;
		var line = models.Line.get(data.message.id);
		if (!line) line = new models.Line(data.message.id);
		line.channel.mentioned++;
		self.emit('userMention');
	});
	wamp.subscribe(PREFIX + 'user#updated', function (data) {
		var user = models.User.get(data.user.id);
		user.username = data.user.username;
		user.firstName = data.user.firstName;
		user.lastName = data.user.lastName;
		user.displayName = data.user.displayName;
		user.is_only_invited = data.user.is_only_invited;
		if (data.user.avatar !== null) user.avatar = data.user.avatar;
		self.emit('change user', user);
	});

	wamp.subscribe(PREFIX + 'notification#new', function (notification) {
		var dispatcher = notification.dispatcher;
		if (dispatcher === 'message' || dispatcher === 'pm') {
			var notificationItem = models.Line.get(notification.message_id);
			if (notificationItem) self.emit('newMsgNotification', notificationItem);
		} else {
			var inviter = models.User.get(notification.inviter_id);
			var room = models.Room.get(notification.channel_id);
			if (!(inviter && room)) return;
			var notificationItem = {
				inviter: inviter,
				room: room
			};
			self.emit('newInviteNotification', notificationItem)
		}
	});
};

var unknownUser = {
	username: 'unknown',
	firstName: 'unknown',
	lastName: 'User'
};

API.prototype._newRoom = function API__newRoom(room) {
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
	if (typeof room.unread === 'undefined') {
		room.unread = 0;
	}
	room.typing = [];

	return room;
};

API.prototype._tryAddRoom = function API__tryAddRoom(room) {
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
API.prototype.setOrganization = function API_setOrganization(org, callback) {
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

API.prototype.endedIntro = function API_endedIntro() {
	this.wamp.call(PREFIX + 'users/set_profile', {'show_intro': false});
};

API.prototype.changedTimezone = function API_changedTimezone(tz) {
	this.wamp.call(PREFIX + 'users/set_profile', {'timezone': tz});
};

API.prototype.openPM = function API_openPM(user, callback) {
	callback = callback || function() {};
	var self = this;
	this.wamp.call(PREFIX + 'pm/open', this.organization.id, user.id, function (err, pm) {
		if (err) return self.emit('error', err);
		pm = self._newRoom(pm);
		self.organization.pms.push(pm);
		user.pm = pm;
		self.emit('newPMOpened', pm);
		callback();
	});
};

API.prototype.createRoom = function API_createRoom(room) {
	room.organization = this.organization.id;
	var self = this;
	this.wamp.call(PREFIX + 'rooms/create', room, function (err, room) {
		if (err) return self.emit('roomcreateerror', err.details);
		self.emit('roomcreated', self._tryAddRoom(room));
	});
};

API.prototype.deleteRoom = function API_deleteRoom(room, roomName, callback) {
	room.organization = this.organization.id;
	var self = this;
	this.wamp.call(PREFIX + 'channels/delete', room.id, roomName, function (err, result) {
		if (callback !== undefined) {
			callback(err, result);
		}
	});
};

API.prototype.joinRoom = function API_joinRoom(room, callback) {
	var self = this;
	if (room.joined) return;
	this.wamp.call(PREFIX + 'channels/join', room.id, function (err) {
		if (err) return self.emit('error', err);
		room.joined = true;
		self.emit('joinedChannel');
		if (callback !== undefined) callback();
	});
};

API.prototype.leaveRoom = function API_leaveRoom(roomID) {
	var self = this;
	var room = models.Room.get(roomID);
	if (!room.joined) return;
	this.wamp.call(PREFIX + 'channels/leave', room.id, function (err) {
		if (err) return self.emit('error', err);
		room.joined = false;
		self.emit('leftChannel', room);
	});
};

API.prototype.renameRoom = function API_renameRoom(roomID, newName) {
	var emit = this.emit.bind(this);
	this.wamp.call(PREFIX + 'rooms/rename', roomID, newName, function(err) {
		if (err) emit('roomrenameerror', err);
	});
}

API.prototype.onSetNotificationsSession = function API_onSetNotificationsSession (orgID) {
	this.wamp.call(PREFIX + 'notifications/set_notification_session', orgID);
};

API.prototype.autocomplete = function API_autocomplete(text, callback) {
	this.wamp.call(
		PREFIX + 'search/autocomplete',
		text,
		this.organization.id,
		// Show all.
		true,
		// Amount of results per section.
		15,
		// Return external services too.
		true,
		function (err, result) {
			if (callback !== undefined) {
				callback(err, result);
			}

		}
	);
};

API.prototype.autocompleteDate = function API_autocompleteDate(text, callback) {
	this.wamp.call(PREFIX + 'search/autocomplete_date', text, this.organization.id,
			function (err, result) {
			if (callback !== undefined) {
				callback(err, result);
			}

	});
};

API.prototype.search = function API_search(text) {
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
			self.emit('gotsearchresults', {
				'results': r,
				'facets': f,
				'total': results.total,
				'q': results.q
			});
		});
};

API.prototype.inviteToRoom = function API_inviteToRoom(room, users, callback) {
	this.wamp.call(PREFIX + 'channels/invite', room.id, users, function(err, result) {
		if (callback !== undefined) {
			callback(err, result);
		}
	});
};

/**
 * Loads history for `room`
 */
API.prototype.getHistory = function API_getHistory(room, options) {
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
		self.emit('gotHistory');
	});
};

API.prototype.onLoadHistoryForSearch = function API_onLoadHistoryForSearch (direction, room, options) {
	this.wamp.call(PREFIX + 'channels/get_history', room.id, options, function (err, res) {
		var lines = res.map(function (line) {
			var exists = models.Line.get(line.id);
			if (!exists || !~room.searchHistory.indexOf(exists)) {
				line.read = true;
				line = new models.Line(line);
				if (direction === 'old')
					room.searchHistory.unshift(line);
				else
					room.searchHistory.push(line);
			}
		});
		this.emit('gotHistory', direction);	
	}.bind(this));
}

API.prototype.setRead = function API_setRead(room, lineID) {
	// update the unread count
	// iterate the history in reverse order
	// (its more likely the read line is at the end)
	var line = models.Line.get(lineID);
	if (!line) return;
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
	this.wamp.call(PREFIX + 'channels/read', room.id, lineID);
};

API.prototype.onRequestMessage = function API_onRequestMessage(room, msgID) {
	// channels/focus_message, room ID, msg ID, before, after, strict
	// strict is false by default
	// when false, fallback results will be returned
	// when true, unexisting msg IDs will throw an error
	this.wamp.call(PREFIX + 'channels/focus_message', room.id, msgID, 25, 25, true, function (err, res ) {
		if (err) return this.emit('messageNotFound', room);
		room.searchHistory.splice(0, room.searchHistory.length);
		var lines = res.map(function (line) {
			var exists = models.Line.get(line.id);
			if (!exists || !~room.searchHistory.indexOf(exists)) {
				line = new models.Line(line);
				line.read = true;
				room.searchHistory.push(line);
			}
		});
		this.emit('focusMessage', msgID);
	}.bind(this));
}

API.prototype.setTyping = function API_setTyping(room, typing) {
	// TODO: emit error?
	this.wamp.call(PREFIX + 'channels/set_typing', room.id, typing);
};

API.prototype.onDeleteMessage = function API_onDeleteMessage(ch, msgId) {
	this.wamp.call(PREFIX + 'channels/delete_message', ch['id'], msgId);
};

API.prototype.publish = function API_publish(room, msg, options) {
	var self = this;
	msg = msg.text ? msg.text : msg;
	this.wamp.call(PREFIX + 'channels/post', room.id, msg, options, function (err) {
		if (err) return self.emit('error', err);
	});
};

API.prototype.updateMsg = function API_updateMessage(msg, text) {
	this.wamp.call(PREFIX + 'channels/update_message', msg['channel'].id, msg['id'], text, function (err) {

	});
};

API.prototype.onKickMember = function API_onKickMember (roomID, memberID) {
	this.wamp.call(PREFIX + 'channels/kick', roomID, parseInt(memberID));
}
