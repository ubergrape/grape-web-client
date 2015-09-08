'use strict';

var Emitter = require('emitter');
var template = require('template');
var events = require('events');
var qs = require('query');
var debounce = require('debounce');

var staticurl = require('staticurl');
var render = require('../rendervdom');

var IMAGES_BASE = staticurl('app/cg/images');

var images = {
	emojiSheet: IMAGES_BASE + '/emoji_sheet_32_optimized.png',
    traubyReading: IMAGES_BASE + '/trauby-reading.png',
    traubyJuggling: IMAGES_BASE + '/trauby-juggling.png',
    noDetail: IMAGES_BASE + '/no-detail.png',
    spinner: staticurl('/images/preloader-onwhite.gif')
};

require('grape-browser');

function GrapeInputIntegration() {
	Emitter.call(this);
	this.room = null;
	this.previous = null;
	this.org = null;
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
	this.input = qs('grape-input', this.el);
	images.orgLogo = this.org.logo;
	this.setProps({focused: true});
};

GrapeInputIntegration.prototype.setProps = function (newProps) {
	var props = {
		images: images,
		customEmojis: this.org.custom_emojis,
		placeholder: this.placeholder,
		hasIntegrations: this.org.has_integrations
	};

	for (var name in newProps) props[name] = newProps[name];
	this.input.props = props;
};

GrapeInputIntegration.prototype.bindEvents = function () {
	this.events = events(this.el, this);
	this.events.bind('click .js-markdown-tips', 'onMarkdownTipsShow');
	this.events.bind('mousedown .js-emoji-browser-button', 'onOpenEmojiBrowser');
	this.events.bind('mousedown .js-search-browser-button', 'onOpenSearchBrowser');
	this.events.bind('grapeComplete grape-input', 'onComplete');
	this.events.bind('grapeSelectFilter grape-input', 'onSelectFilter');
	this.events.bind('grapeEditPrevious grape-input', 'onEditPrevious');
	this.events.bind('grapeAbort grape-input', 'onAbort');
	this.events.bind('grapeChange grape-input', 'onChange');
	this.events.bind('grapeSubmit grape-input', 'onSubmit');
	this.events.bind('grapeFocus grape-input', 'onFocus');
	this.events.bind('grapeBlur grape-input', 'onBlur');
	this.events.bind('grapeAddIntegration grape-input', 'onAddIntegration');
	this.events.bind('grapeInsertItem grape-input', 'onInsertItem');
};

GrapeInputIntegration.prototype.setRoom = function (room) {
	this.completePreviousEdit();
    if (!room || (room.type == "pm" && !room.users[0].active)) {
    	this.disable();
	}
	else {
		this.enable();
	}
	this.room = room;
};

GrapeInputIntegration.prototype.disable = function () {
	if (this.input.props.disabled) return;
	this.completePreviousEdit();
	this.el.classList.add('disabled');
	this.setProps({
		disabled: true,
		placeholder: 'You cannot reply to this conversation.'
	});
};

GrapeInputIntegration.prototype.enable = function () {
	if (!this.input.props.disabled) return;
	this.el.classList.remove('disabled');
	this.setProps({
		disabled: false,
		placeholder: this.placeholder
	});
};

GrapeInputIntegration.prototype.redraw = function () {
	var vdom = template('grapeinputintegration.jade', {});
	render(this, vdom);
};

GrapeInputIntegration.prototype.showSearchBrowser = function (key) {
	var props = this.input.props
	// Show browser immediately with empty state.
	this.setProps({
		browser: 'search',
		data: props.browser == 'search' ? props.data : null,
		isLoading: true
	});
	this.debouncedSearch(key);
};

GrapeInputIntegration.prototype.showUsersAndRooms = function (key) {
	key = key.toLowerCase();
	var users = this.findUsers(key);
	var rooms = this.findRooms(key);
	var data = users.concat(rooms);
	this.setProps({
		browser: 'user',
		data: data
	});
};

GrapeInputIntegration.prototype.showEmojiBrowser = function () {
	this.setProps({browser: 'emoji'});
};

GrapeInputIntegration.prototype.findUsers = function (key) {
	var users = this.org.users.toArray();

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
	var rooms = this.org.rooms.toArray();

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

GrapeInputIntegration.prototype.completePreviousEdit = function () {
	if (!this.previous) return;
	this.previous.el.classList.remove('editing');
	this.el.classList.remove('editing-previous');

	var avatar = qs('.avatar.editing');
	if (avatar) {
		avatar.classList.remove('editing');
	}

	this.input.setTextContent('');
	this.previous = null;
};

GrapeInputIntegration.prototype.editMessage = function (msg) {
	this.completePreviousEdit();
	var el = qs('.message[data-id="' + msg.id + '"]');
	el.classList.add('editing');
	this.el.classList.add('editing-previous');
	this.input.setTextContent(msg.text);
	this.previous = {
		msg: msg,
		el: el
	};
};

GrapeInputIntegration.prototype.findPreviousMessage = function () {
	var message;
	var history = this.room.history.slice().reverse();
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

GrapeInputIntegration.prototype.getAttachments = function (objects) {
	// Find embeddable images.
	objects = objects.filter(function (obj) {
		if (isImage(obj.mime_type) &&
			obj.detail &&
			obj.detail.preview &&
			obj.detail.preview.embeddable) {
			return true;
		}
		return false;
	});

	var attachments = objects.map(function (obj) {
		var image = obj.detail.preview.image;

		return {
			name: obj.name,
			url: obj.url,
			source: obj.service,
			mime_type: obj.mime_type,
			thumbnail_url: image.url,
			thumbnail_width: image.width,
			thumbnail_height: image.height
		};
	});

	return attachments;
};

GrapeInputIntegration.prototype.onMarkdownTipsShow = function () {
	this.emit('showmarkdowntips');
};

GrapeInputIntegration.prototype.onComplete = function (e) {
	var query = e.detail;

	switch (query.trigger) {
		case '#':
			this.showSearchBrowser(query.key)
			break;
		case '@':
			this.showUsersAndRooms(query.key)
			break;
	}
};

GrapeInputIntegration.prototype.onSelectFilter = function (e) {
	this.emit('autocomplete', e.detail.key, function (err, data) {
		if (err) return this.emit('error', err);
		this.setProps({
			browser: 'search',
			data: data
		});
	}.bind(this));
};

GrapeInputIntegration.prototype.onEditPrevious = function () {
	var msg = this.findPreviousMessage();
	if (msg) this.editMessage(msg);
};

GrapeInputIntegration.prototype.onAbort = function (e) {
	var data = e.detail;

	// Don't abort editing if browser has been open.
	if (!data.browser) this.completePreviousEdit();
    if (data.browser == 'search' && data.reason == 'esc') {
    	analytics.track('abort autocomplete', data);
    }
};

GrapeInputIntegration.prototype.onChange = function () {
	if (!this.typing) {
		this.typing = true;
		this.emit('starttyping', this.room);
	}
	this.debouncedStopTyping();
};

GrapeInputIntegration.prototype.debouncedSearch = debounce(function (key) {
	this.emit('autocomplete', key, function (err, data) {
		if (err) return this.emit('error', err);
		this.setProps({
			browser: 'search',
			data: data
		});
	}.bind(this));
}, 200);

GrapeInputIntegration.prototype.onSubmit = function (e) {
	var data = e.detail;

	if (this.previous) {
		this.emit('update', this.previous.msg, data.content);
		this.completePreviousEdit();
	}
	else {
		this.emit('input', this.room, data.content);
		var attachments = this.getAttachments(data.objects);
		if (attachments.length) {
			this.emit('input', this.room, '', {attachments: attachments});
		}
		this.input.setTextContent('');
	}
};

GrapeInputIntegration.prototype.onFocus = function () {
	this.el.classList.add('focus');
};

GrapeInputIntegration.prototype.onBlur = function () {
	this.el.classList.remove('focus');
};

GrapeInputIntegration.prototype.onOpenEmojiBrowser = function (e) {
	e.preventDefault();
	this.showEmojiBrowser();
};

GrapeInputIntegration.prototype.onOpenSearchBrowser = function (e) {
	e.preventDefault();
	this.showSearchBrowser('');
};

GrapeInputIntegration.prototype.onOrgReady = function (org) {
	this.org = org;
	this.init();
};

GrapeInputIntegration.prototype.onAddIntegration = function () {
	location.href = '/services/list'
};

GrapeInputIntegration.prototype.onInsertItem = function (e) {
	analytics.track('insert autocomplete object', e.detail);
};

function isImage(mime) {
	return String(mime).substr(0, 5) == 'image';
}
