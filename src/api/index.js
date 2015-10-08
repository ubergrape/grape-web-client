'use strict';

var Client = require('lpio-client');
var rpc = require('./rpc');
var array = require('array');
var Emitter = require('emitter');
var models = require('./models');
var conf = require('conf');
var noop = require('lodash/utility/noop');

var exports = module.exports = API;
exports.models = models;

function API() {
    Emitter.call(this);
    // the currently signed in user
    this.user = undefined;
    // user settings
    this.settings = undefined;
    // list of all the organizations the user belongs to
    this.organizations = undefined;
    // the currently active organization
    this.organization = undefined;
    this._typingTimeouts = [];
    this.client = new Client({url: conf.pubsubUrl});
    // A channel for incomming events.
    this.in = new Emitter();
    this.subscribe();
}

API.prototype = Object.create(Emitter.prototype);

API.prototype.connect = function API_connect() {
    var channel = this.client.connect();
    // TODO We might want to differentiate here and log some errors to sentry.
    channel.on('error', console.error.bind(console));
    channel.on('connected', function() {
        // Resync the whole data if we got a new client id, because we might have
        // missed some messages. This is related to the current serverside arch.
        channel.on('set:id', function() {
            this.sync();
        }.bind(this));
        this.sync();
    }.bind(this));
    channel.on('disconnected', function() {
        channel.off('set:id');
        this.emit('disconnected');
    }.bind(this));
    channel.on('data', function(data) {
        this.in.emit(data.event, data);
    }.bind(this));
    channel.on('unauthorized', function() {
        location.href = '/accounts/login';
    });
};

API.prototype.sync = function API_sync() {
    rpc({
        ns: 'users',
        action: 'get_profile'
    }, function(err, data) {
        if (err) return this.emit('error', err);
        this.user = new models.User(data);
        this.user.active = true;
        this.settings = this.user.settings;
        this.organizations = array(data.organizations.map(function (org) {
            return new models.Organization(org);
        }));
        this.emit('changeUser', this.user);
        this.emit('change settings', this.settings);
        this.emit('change organizations', this.organizations);
        this.emit('connected');
    }.bind(this));
};

API.prototype.subscribe = function API_subscribe() {
    var self = this;
    // channel events
    this.in.on('channel.new', function (data) {
        self._tryAddRoom(data.channel);
        self.emit('newRoom', data.channel);
    });
    this.in.on('channel.updated', function (data) {
        var room = models.Room.get(data.channel.id);
        room.name = data.channel.name;
        room.slug = data.channel.slug;
        room.description = data.channel.description;
        self.emit('channelupdate', room);
    });
    this.in.on('channel.removed', function(data) {
        var room = models.Room.get(data.channel);
        var index = self.organization.rooms.indexOf(room);
        if (~index)
            self.organization.rooms.splice(index, 1);
        self.emit('roomdeleted', room);
    });
    this.in.on('channel.typing', function (data) {
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
    this.in.on('channel.read', function (data) {
        var user = models.User.get(data.user);
        var line = models.Line.get(data.message);
        if (!line) return; // ignore read notifications for messages we don’t have
        var room = line.channel;
        // ignore this for the current user, we track somewhere else
        if (user === self.user) {
            room.unread = 0;
            room.mentioned = 0;
            return self.emit('channelRead');
        }
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
    this.in.on('channel.joined', function (data) {
        var user = models.User.get(data.user);
        var room = models.Room.get(data.channel);
        if (~room.users.indexOf(user)) return;
        // if the user joining the room is the visitor,
        // we need to emit the leftChannel event as well
        // to ensure consistent behaviour across clients
        if (user === self.user) {
            room.joined = true;
            self.emit('joinedChannel', room);
        }
        room.users.push(user);
        self.emit('newRoomMember', room);
    });
    this.in.on('channel.left', function (data) {
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
    this.in.on('organization.joined', function (data) {
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
            self.emit('newOrgMember', user);
        }
    });
    this.in.on('organization.left', function (data) {
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
    this.in.on('message.new', function (data) {
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
    this.in.on('message.updated', function(data) {
        var msg = models.Line.get(data['id']);
        if (!msg) return;
        // right now only text can be updated
        msg.text = data.text;
        var ch = models.Room.get(data['channel']);
        var idx = ch.history.indexOf(msg);
        if (~idx) ch.history.splice(idx, 1, msg);
    });
    this.in.on('message.removed', function(data) {
        var msg = models.Line.get(data['id']);
        var ch = models.Room.get(data['channel']);
        var idx = ch.history.indexOf(msg);
        if (~idx) ch.history.splice(idx, 1);
    });

    // user events
    this.in.on('user.status', function (data) {
        var user = models.User.get(data.user);
        user.status = data.status;
        self.emit('changeUser', user);
    });
    this.in.on('user.mentioned', function (data) {
        if (data.message.organization !== self.organization.id) return;
        var line = models.Line.get(data.message.id);
        if (!line) line = new models.Line(data.message.id);
        line.channel.mentioned++;
        self.emit('userMention');
    });
    this.in.on('user.updated', function (data) {
        var user = models.User.get(data.user.id);
        user.username = data.user.username;
        user.firstName = data.user.firstName;
        user.lastName = data.user.lastName;
        user.displayName = data.user.displayName;
        user.email = data.user.email;
        user.is_only_invited = data.user.is_only_invited;
        user.what_i_do = data.user.what_i_do;
        user.skype_username = data.user.skype_username;
        user.phone_number = data.user.phone_number;
        if (data.user.avatar !== null) user.avatar = data.user.avatar;
        self.emit('changeUser', user);
    });

    this.in.on('membership.updated', function (data) {
        var user = models.User.get(data.membership.user);
        var changed = [];
        if (user.role != data.membership.role) {
            changed.push('role')
            user.role = data.membership.role;
        }
        if (user.title !== data.membership.title) {
            changed.push('title')
            user.title = data.membership.title;
        }
        self.emit('changeUser', user, changed);
    });

    this.in.on('notification.new', function (notification) {
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
    callback || (callback = noop);
    var self = this;
    // TODO: this should also leave any old organization

    // first get the details
    rpc({
        ns: 'organizations',
        action: 'get_organization',
        args: [org.id]
    }, function(err, res) {
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
       
        org.inviter_role = res.inviter_role;
        // connect users and pms
        org.pms.forEach( function(pm) { pm.users[0].pm = pm; });

        // then join
        rpc({
            ns: 'organizations',
            action: 'join',
            clientId: this.client.id,
            args: [org.id]
        }, function(err) {
            if (err) return self.emit('error', err);
            self.organization = org;
            // put role and title in user object for consistency with other user objects
            self.user.role = self.organization.role;
            self.user.title = self.organization.title;
            self.emit('change organization', org);
            callback();
        }.bind(this));
    }.bind(this));
};

API.prototype.getRoomIcons = function API_getRoomIcons(org, callback) {
    callback || (callback = noop);
    rpc({
        ns: 'organizations',
        action: 'list_icons',
        args: [org.id]
    }, function(err, res) {
        if (err) return this.emit('error', err);
        callback();
    }.bind(this));
}

API.prototype.endedIntro = function API_endedIntro() {
    rpc({
        ns: 'users',
        action: 'set_profile',
        args: [{show_intro: false}]
    }, function(err) {
        if (err) return this.emit('error', err);
    }.bind(this));
};

API.prototype.changedTimezone = function API_changedTimezone(tz) {
    rpc({
        ns: 'users',
        action: 'set_profile',
        args: [{timezone: tz}]
    }, function(err) {
        if (err) return this.emit('error', err);
    }.bind(this));
};

API.prototype.onEditView = function API_onEditView(status) {
    rpc({
        ns: 'users',
        action: 'set_profile',
        args: [{compact_mode: status}]
    }, function(err) {
        if (err) return this.emit('error', err);
        this.user.settings.compact_mode = status;
        this.emit('viewChanged', status);
    }.bind(this));
};

API.prototype.openPM = function API_openPM(user, callback) {
    callback || (callback = noop);
    rpc({
        ns: 'pm',
        action: 'open',
        args: [this.organization.id, user.id]
    }, function(err, pm) {
        if (err) return this.emit('error', err);
        pm = this._newRoom(pm);
        this.organization.pms.push(pm);
        user.pm = pm;
        this.emit('newPMOpened', pm);
        callback();
    }.bind(this));
};

API.prototype.onCreateRoom = function API_onCreateRoom(room) {
    room.organization = this.organization.id;
    rpc({
        ns: 'rooms',
        action: 'create',
        args: [room]
    }, function(err, room) {
        if (err) return this.emit('roomCreationError', err.details);
        this.emit('roomCreated', this._tryAddRoom(room));
    }.bind(this));
};

API.prototype.deleteRoom = function API_deleteRoom(room, roomName, callback) {
    room.organization = this.organization.id;
    rpc({
        ns: 'channels',
        action: 'delete',
        args: [room.id, roomName]
    }, callback);
};

API.prototype.joinRoom = function API_joinRoom(room, callback) {
    if (room.joined) return;
    callback || (callback = noop);
    rpc({
        ns: 'channels',
        action: 'join',
        args: [room.id]
    }, function(err) {
        if (err) return this.emit('error', err);
        room.joined = true;
        callback();
    }.bind(this));
};

API.prototype.onLeaveRoom = function API_onLeaveRoom(roomId) {
    var room = models.Room.get(roomId);
    if (!room.joined) return;
    rpc({
        ns: 'channels',
        action: 'leave',
        args: [room.id]
    }, function(err) {
        if (err) return this.emit('error', err);
        room.joined = false;
    }.bind(this));
};

API.prototype.renameRoom = function API_renameRoom(roomId, newName) {
    rpc({
        ns: 'rooms',
        action: 'rename',
        args: [roomId, newName]
    }, function(err) {
        if (err) return this.emit('roomrenameerror', err);
    }.bind(this));
}

API.prototype.onSetNotificationsSession = function API_onSetNotificationsSession (orgId) {
    rpc({
        ns: 'notifications',
        action: 'set_notification_session',
        clientId: this.client.id,
        args: [orgId]
    }, function(err) {
        if (err) return this.emit('error', err);
    }.bind(this));
};

API.prototype.autocomplete = function API_autocomplete(text, callback) {
    rpc({
        ns: 'search',
        action: 'autocomplete',
        args: [
            text,
            this.organization.id,
            // Show all.
            true,
            // Amount of results per section.
            15,
            // Return external services too.
            true
        ]
    }, callback);
};

API.prototype.autocompleteDate = function API_autocompleteDate(text, callback) {
    rpc({
        ns: 'search',
        action: 'autocomplete_date',
        args: [text, this.organization.id]
    }, callback);
};

API.prototype.search = function API_search(text) {
    rpc({
        ns: 'search',
        action: 'search',
        args: [text, this.organization.id]
    }, function(err, results) {
        if (err) return this.emit('error', err);
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
        this.emit('gotsearchresults', {
            'results': r,
            'facets': f,
            'total': results.total,
            'q': results.q
        });
    }.bind(this));
};

API.prototype.onInviteToRoom = function API_onInviteToRoom(room, users) {
    rpc({
        ns: 'channels',
        action: 'invite',
        args: [room.id, users]
    }, function(err, res) {
        if (err) return;
        this.emit('roomInviteSuccess');
    }.bind(this));
};

/**
 * Loads history for `room`
 */
API.prototype.getHistory = function API_getHistory(room, options) {
    options = options || {};
    rpc({
        ns: 'channels',
        action: 'get_history',
        args: [room.id, options]
    }, function(err, res) {
        if (err) return this.emit('error', err);
        // so when the first message in history is read, assume the history as read
        // as well
        var read = !!room.history.length && room.history[0].read;
        if (res.length === 0) return this.emit('nohistory');
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
        this.emit('gotHistory');
    }.bind(this));
};

API.prototype.onLoadHistoryForSearch = function API_onLoadHistoryForSearch (direction, room, options) {
    rpc({
        ns: 'channels',
        action: 'get_history',
        args: [room.id, options]
    }, function(err, res) {
        if (err) return this.emit('error', err);
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

API.prototype.setRead = function API_setRead(room, lineId) {
    // update the unread count
    // iterate the history in reverse order
    // (its more likely the read line is at the end)
    var line = models.Line.get(lineId);
    if (!line) return;
    room.mentioned = 0;
    var setread = false;
    for (var i = room.history.length - 1; i >= 0; i--) {
        var l = room.history[i];
        if (l.read) break;
        if (l === line) {
            setread = true;
            room.unread = room.history.length - i - 1;
        }
        if (setread) l.read = true;
    }
    if (!setread) return;
    // and notify the server
    // TODO: emit error?
    rpc({
        ns: 'channels',
        action: 'read',
        args: [room.id, lineId]
    }, function(err) {
        if (err) return this.emit('error', err);
    });
};

API.prototype.onRequestMessage = function API_onRequestMessage(room, msgId) {
    // channels/focus_message, room ID, msg ID, before, after, strict
    // strict is false by default
    // when false, fallback results will be returned
    // when true, unexisting msg IDs will throw an error
    rpc({
        ns: 'channels',
        action: 'focus_message',
        args: [room.id, msgId, 25, 25, true]
    }, function (err, res ) {
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
        this.emit('focusMessage', msgId);
    }.bind(this));
}

API.prototype.setTyping = function API_setTyping(room, typing) {
    rpc({
        ns: 'channels',
        action: 'set_typing',
        args: [room.id, typing]
    }, function(err) {
        if (err) return this.emit('error', err);
    }.bind(this));
};

API.prototype.onDeleteMessage = function API_onDeleteMessage(ch, msgId) {
    rpc({
        ns: 'channels',
        action: 'delete_message',
        args: [ch.id, msgId]
    }, function(err) {
        if (err) return this.emit('error', err);
    }.bind(this));
};

API.prototype.publish = function API_publish(room, msg, options) {
    msg = msg.text ? msg.text : msg;
    rpc({
        ns: 'channels',
        action: 'post',
        args: [room.id, msg, options]
    }, function(err) {
        if (err) return this.emit('error', err);
    }.bind(this));
};

API.prototype.updateMsg = function API_updateMessage(msg, text) {
    rpc({
        ns: 'channels',
        action: 'update_message',
        args: [msg.channel.id, msg.id, text]
    }, function(err) {
        if (err) return this.emit('error', err);
    }.bind(this));
};

API.prototype.onKickMember = function API_onKickMember (roomId, memberId) {
    rpc({
        ns: 'channels',
        action: 'kick',
        args: [roomId, Number(memberId)]
    }, function(err) {
        if (err) return this.emit('error', err);
    }.bind(this));
};

API.prototype.onSetDescription = function(room, description) {
    rpc({
        ns: 'rooms',
        action: 'setDescription',
        args: [room.id, description]
    }, function(err) {
        if (err) return this.emit('error', err);
    }.bind(this));
};

API.prototype.onInviteToOrg = function(emails) {
    rpc({
        ns: 'organizations',
        action: 'invite',
        args: [this.organization.id, {emails: emails}]
    }, function(err, res) {
        console.log(err, res);
        if (err) return this.emit('inviteError');
        this.emit('inviteSuccess');
    }.bind(this));
};