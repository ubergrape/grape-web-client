'use strict';

var Emitter = require('emitter');
var template = require('template');
var events = require('events');
var q = require('query');
var debounce = require('debounce');

var staticurl = require('staticurl');
var render = require('../rendervdom');

var emojiSheet = staticurl('app/cg/images/emoji_sheet_32_optimized.png');


require('grape-input');

function GrapeInputIntegration() {
	Emitter.call(this);
	this.room = null;
	this.previous = null;
	this.redraw();
	this.placeholder = 'Enter a message ...';
	this.typing = false;
}

GrapeInputIntegration.prototype = Object.create(Emitter.prototype);
module.exports = GrapeInputIntegration;

GrapeInputIntegration.prototype.init = function () {
	if (this.initialized) return;
	this.initialized = true;
	this.bindEvents();
	this.input = q('grape-input', this.el);
	this.input.setProps({
		emojiSheet: emojiSheet,
		customEmojis: app.organization.custom_emojis,
		focused: true,
		placeholder: this.placeholder
	});
};

GrapeInputIntegration.prototype.bindEvents = function () {
	this.events = events(this.el, this);
	this.events.bind('click .js-markdown-tips', 'onMarkdownTipsShow');
	this.events.bind('grapeComplete grape-input', 'onComplete');
	this.events.bind('grapeEditPrevious grape-input', 'onPreviousEdit');
	this.events.bind('grapeAbort grape-input', 'onAbort');
	this.events.bind('grapeChange grape-input', 'onChange');
	this.events.bind('grapeSubmit grape-input', 'onSubmit');
	this.events.bind('grapeFocus grape-input', 'onFocus');
	this.events.bind('grapeBlur grape-input', 'onBlur');
};

GrapeInputIntegration.prototype.setRoom = function (room) {
	this.init();
	this.completePreviousEditing();
    if (!room || (room.type == "pm" && !room.users[0].active)) {
    	this.disable();
	}
	else {
		this.enable();
	}
	this.room = room;
};

GrapeInputIntegration.prototype.disable = function () {
	this.completePreviousEditing();
	this.el.classList.add('disabled');
	this.input.setProps({
		disabled: true,
		placeholder: 'You cannot reply to this conversation.'
	});
	this.input.blur();
};

GrapeInputIntegration.prototype.enable = function () {
	this.el.classList.remove('disabled');
	this.input.setProps({
		disabled: false,
		placeholder: this.placeholder
	});
};

GrapeInputIntegration.prototype.redraw = function () {
	var vdom = template('grapeinputintegration.jade', {});
	render(this, vdom);
};

GrapeInputIntegration.prototype.showBrowser = function (search) {
	this.emit('autocomplete', search.key, function (err, data) {
		if (err) return this.emit('error', err);
		this.input.setProps({
			data: data,
			type: 'search',
			key: search.key
		});
	}.bind(this));
};

GrapeInputIntegration.prototype.showUsersAndRooms = function (search) {
	var key = search.key.toLowerCase();
	var users = this.findUsers(key);
	var rooms = this.findRooms(key);
	var data = users.concat(rooms);

	this.input.setProps({
		data: data,
		type: 'user'
	});
};

GrapeInputIntegration.prototype.findUsers = function (key) {
	var users = app.organization.users.toArray();

	// Remove unactive users.
	users = users.filter(function(user) {
		return user.active;
	});

	// Map to a unified data structure.
	users = users.map(function (user) {
		var name = user.username;
		if (user.firstName) {
			name = user.firstName;
			if (user.lastName) name += ' ' + user.lastName;
		}

		return {
			id: user.id,
			name: name,
			username: user.username,
			iconURL: user.avatar,
			type: 'user'
		};
	});

	// Do the search.
	users = users.filter(function(user) {
		if (user.name.toLowerCase().indexOf(key) >= 0 ||
			user.username.toLowerCase().indexOf(key) >= 0) {
			return true;
		}
	});

	return users;
};

GrapeInputIntegration.prototype.findRooms = function (key) {
	var rooms = app.organization.rooms.toArray();

	rooms = rooms.map(function (room) {
		return {
			id: room.id,
			type: 'room',
			name: room.name,
			slug: room.slug
		};
	});

	// Do the search.
	rooms = rooms.filter(function(room) {
		return room.name.toLowerCase().indexOf(key) >= 0;
	});

	return rooms;
};

GrapeInputIntegration.prototype.showEmojis = function (search) {
	this.input.setProps({
		type: 'emoji',
		key: search.key
	});
};

GrapeInputIntegration.prototype.completePreviousEditing = function () {
	if (!this.previous) return;
	this.previous.el.classList.remove('editing');
	this.el.classList.remove('editing-previous');
	this.input.setContent('');
	this.previous = null;
};

GrapeInputIntegration.prototype.editMessage = function (msg) {
	var el = q('.message[data-id="' + msg.id + '"]');
	el.classList.add('editing');
	this.el.classList.add('editing-previous');
	this.input.setContent(msg.text);
	this.previous = {
		msg: msg,
		el: el
	};
};

GrapeInputIntegration.prototype.findPreviousMessage = function () {
	var message;
	var history = this.room.history.slice();
	history.reverse();
	history.some(function(msg) {
		// TODO avoid globals.
		if (msg.author == ui.user && !msg.attachments.length) {
			message = msg;
			return true;
		}
	});

	return message;
};

GrapeInputIntegration.prototype.debouncedStopTyping = debounce(function () {
	this.typing = false;
	this.emit('stoptyping', this.room);
}, 1000);

GrapeInputIntegration.prototype.onMarkdownTipsShow = function () {
	this.emit('showmarkdowntips');
};

GrapeInputIntegration.prototype.onComplete = function (e) {
	var data = e.detail;
	switch (data.trigger) {
		case '#':
			this.showBrowser(data)
			break;
		case '@':
			this.showUsersAndRooms(data)
			break;
		case ':':
			this.showEmojis(data)
			break;
	}
};

GrapeInputIntegration.prototype.onPreviousEdit = function () {
	var msg = this.findPreviousMessage();
	if (msg) this.editMessage(msg);
};

GrapeInputIntegration.prototype.onAbort = function () {
	this.completePreviousEditing();
};

GrapeInputIntegration.prototype.onChange = function () {
	if (!this.typing) {
		this.typing = true;
		this.emit('starttyping', this.room);
	}
	this.debouncedStopTyping();
};

GrapeInputIntegration.prototype.onSubmit = function () {
	var content = this.input.getTextContent();

	if (this.previous) {
		this.emit('update', this.previous.msg, content);
		this.completePreviousEditing();
	}
	else {
		this.emit('input', this.room, content);
		this.input.setContent('');
	}
};

GrapeInputIntegration.prototype.onFocus = function () {
	this.el.classList.add('focus');
};

GrapeInputIntegration.prototype.onBlur = function () {
	this.el.classList.remove('focus');
};
