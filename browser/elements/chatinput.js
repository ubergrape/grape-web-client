'use strict';

var Emitter = require('emitter');
var template = require('template');
var events = require('events');
var q = require('query');
var debounce = require('debounce');

var staticurl = require('staticurl');
var render = require('../rendervdom');
var MarkdownTipsDialog = require('./dialogs/markdowntips');

var emojiSheet = staticurl('app/cg/images/emoji_sheet_32_optimized.png');

function ChatInput() {
	Emitter.call(this);
	this.room = null;
	this.previous = null;
	this.render();
	this.placeholder = 'Enter a message ...';
}

ChatInput.prototype = Object.create(Emitter.prototype);
module.exports = ChatInput;

ChatInput.prototype.init = function () {
	if (this.initialized) return;
	this.initialized = true;
	this.bindEvents();
	this.markdownTips = new MarkdownTipsDialog().closable();
	this.input = q('grape-input', this.el);
	this.input.setProps({
		emojisheet: emojiSheet,
		customemojis: app.organization.custom_emojis,
		focused: true,
		placeholder: this.placeholder
	});
};

ChatInput.prototype.bindEvents = function () {
	this.events = events(this.el, this);
	this.events.bind('click .js-markdown-tips', 'showMarkdownTips');
	this.events.bind('grapeComplete grape-input', 'onComplete');
	this.events.bind('grapeEditPrevious grape-input', 'onPreviousEdit');
	this.events.bind('grapeAbort grape-input', 'onAbort');
	this.events.bind('grapeChange grape-input', 'onChange');
	this.events.bind('grapeSubmit grape-input', 'onSubmit');
	this.events.bind('grapeFocus grape-input', 'onFocus');
	this.events.bind('grapeBlur grape-input', 'onBlur');
};

ChatInput.prototype.setRoom = function (room) {
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

ChatInput.prototype.disable = function () {
	this.completePreviousEditing();
	this.el.classList.add('disabled');
	this.input.setProps({
		disabled: true,
		placeholder: 'You cannot reply to this conversation.'
	});
	this.input.blur();
};

ChatInput.prototype.enable = function () {
	this.el.classList.remove('disabled');
	this.input.setProps({
		disabled: false,
		placeholder: this.placeholder
	});
};

ChatInput.prototype.render = function () {
	var vdom = template('chatinput.jade', {});
	render(this, vdom);
};

ChatInput.prototype.showMarkdownTips = function (e) {
	this.markdownTips.overlay().show();
};

ChatInput.prototype.showBrowser = function (search) {
	this.emit('autocomplete', search.key, function (err, data) {
		if (err) return this.emit('error', err);
		this.input.setProps({
			data: data,
			type: 'search'
		});
	}.bind(this));
};

ChatInput.prototype.showUsersAndRooms = function (search) {
	var key = search.key.toLowerCase();
	var users = this.findUsers(key);
	var rooms = this.findRooms(key);
	var data = users.concat(rooms);

	this.input.setProps({
		data: data,
		type: 'user'
	});
};

ChatInput.prototype.findUsers = function (key) {
	var users = app.organization.users.toJSON();

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

ChatInput.prototype.findRooms = function (key) {
	var rooms = app.organization.rooms.toJSON();

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

ChatInput.prototype.showEmojis = function (search) {
	this.input.setProps({
		type: 'emoji',
		key: search.key
	});
};

ChatInput.prototype.completePreviousEditing = function() {
	if (!this.previous) return;
	this.previous.el.classList.remove('editing');
	this.el.classList.remove('editing-previous');
	this.input.setProps({content: ''})
	this.previous = null;
};

ChatInput.prototype.findPreviousMessage = function () {
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

ChatInput.prototype.debouncedStopTyping = debounce(function () {
	this.emit('stoptyping', this.room);
}, 1000);

ChatInput.prototype.onComplete = function (e) {
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

ChatInput.prototype.onPreviousEdit = function (e) {
	var msg = this.findPreviousMessage();
	if (!msg) return;
	var el = q('.message[data-id="' + msg.id + '"]');
	el.classList.add('editing');
	this.el.classList.add('editing-previous');
	this.input.setProps({content: msg.text});
	this.previous = {
		msg: msg,
		el: el
	};
};

ChatInput.prototype.onAbort = function () {
	this.completePreviousEditing();
};

ChatInput.prototype.onChange = function () {
	this.emit('starttyping', this.room);
	this.debouncedStopTyping();
};

ChatInput.prototype.onSubmit = function (e) {
	var content = this.input.getContent();

	if (this.previous) {
		this.emit('update', this.previous.msg, content);
		this.completePreviousEditing();
	}
	else {
		this.emit('input', this.room, content);
		this.input.setProps({content: ''});
	}
};

ChatInput.prototype.onFocus = function (e) {
	this.el.classList.add('focus');
};

ChatInput.prototype.onBlur = function (e) {
	this.el.classList.remove('focus');
};
