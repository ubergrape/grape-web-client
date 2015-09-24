/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Dialog = require('./dialog');
var events = require('events');
var qs = require('query');
var closest = require('closest');
var ItemList = require('../itemlist');
var keyname = require('keyname');
var render = require('../../rendervdom');
var template = require('template');

module.exports = RoomInvite;

function RoomInvite(context) {
	this.template_path = 'dialogs/room-invite.jade';
	this.formContent = {};
	this.query = null;
	Dialog.call(this, context);
};

RoomInvite.prototype = Object.create(Dialog.prototype);

var protoInit = RoomInvite.prototype.init;

RoomInvite.prototype.init = function () {
	protoInit.call(this);

	var context = this.context;
	var userList = this.userList = new ItemList({
		template: 'dialogs/userlist.jade'
	});
	userList.setItems(context.users);
	userList.order('displayName');
	this.uninvitedUsers = context.users;

	if (!this.uninvitedUsers.length) return;

	replace(qs('.invite-list', this.dialog.el), userList.el);
	this.redrawFormContent([], '');
	replace(qs('.form-content', this.dialog.el), this.formContent.el);
};

function replace(from, to) {
	from.parentNode.replaceChild(to, from);
};

RoomInvite.prototype.bind = function () {
	this.events = events(this.el, this);
	this.events.bind('click .form-content', 'focusInput');
	this.events.bind('click .invite-to-room .user', 'onUserClick');
	this.events.bind('click .btn-invite', 'inviteToRoom');
	this.events.bind('keyup .input-invite', 'onKeyUp');
	this.events.bind('keydown .input-invite', 'onKeyDown');

	var navigate = function (e) {
		e.preventDefault();
		var userList = this.userList;
		var items = userList.items.filter(function (item) {
			return userList.highlighted.indexOf(item) == -1;
		});
		var selectedIndex = items.indexOf(userList.selected);

		switch (keyname(e.keyCode)) {
			case 'up':
				if (!userList.selected) return;
				var isSelectedFirst = selectedIndex == 0 ? true : false;
				if (isSelectedFirst) {
					userList.selectItem(items[items.length - 1]);
				} else {
					userList.selectItem(items[selectedIndex - 1]);
				}
				break;

			case 'down':
				if (!userList.selected) {
					return userList.selectItem(items[0]);
				} else {
					var isSelectedLast = selectedIndex == items.length - 1 ? true : false;
					if (isSelectedLast) {
						userList.selectItem(items[0]);
					} else {
						userList.selectItem(items[selectedIndex + 1]);
					}
				}
				break;

			case 'enter':
				if (!userList.selected) return;
				this.toggleUser(userList.selected);
				break;

			default:
				break;
		}

	}.bind(this);

	this.dialog.on('hide', function () {
		document.removeEventListener('keyup', navigate);
	});
	this.dialog.on('show', function () {
		if (!this.userList.items.length) return;
		document.addEventListener('keyup', navigate);
		this.focusInput();
	}.bind(this));
};

RoomInvite.prototype.onUserClick = function (e) {
	var itemID = closest(e.target, 'li', true).getAttribute('data-id');
	var item = this.userList.items.filter(function (el){
		return el.id == itemID;
	})[0];
	this.toggleUser(item);
};

RoomInvite.prototype.toggleUser = function (item) {
	this.userList.toggleItem(item);
	this.redrawFormContent(this.userList.highlighted, '');
	this.filterUsers();
	this.query = '';
	this.userList.selectItem(null);
	this.focusInput();
};

RoomInvite.prototype.focusInput = function () {
	qs('.input-invite', this.dialog.el).focus();
};

RoomInvite.prototype.onKeyDown = function (e) {
	var filterInput = qs('.input-invite', this.dialog.el);
	var query = filterInput.value;
	if (!filterInput.selectionEnd && keyname(e.keyCode) == 'backspace') {
		this.userList.highlighted.pop();
		this.redrawFormContent(this.userList.highlighted, query);
		this.focusInput();
	};
};

RoomInvite.prototype.onKeyUp = function (e) {
	var filterInput = qs('.input-invite', this.dialog.el);
	var query = filterInput.value;
	if (query != this.query) this.filterUsers(query);
	this.query = query;
	filterInput.style.width = 20 + filterInput.value.length * 7 + 'px';
	this.userList.redraw();
};

RoomInvite.prototype.filterUsers = function (query) {
	if (query) {
		var suggestions = this.uninvitedUsers.filter(function (user) {
			return user.username.toLowerCase().indexOf(query) != -1
				|| user.displayName.toLowerCase().indexOf(query) != -1
		});
		suggestions.sort(function (a, b) {
			if (a.username.toLowerCase().startsWith(query)
				|| a.displayName.toLowerCase().startsWith(query)) {
				return -1
			} else {
				return 1
			}
		});
		this.userList.items = suggestions;
		this.userList.selectItem(suggestions[0]);
	} else {
		this.userList.items = this.uninvitedUsers;
		this.userList.selectItem(null);
	}
};

RoomInvite.prototype.inviteToRoom = function () {
	var usernames = this.userList.highlighted.map(function (user) {
		return user.username;
	});
	if (!usernames.length) return;
	this.emit('inviteToRoom', this.context.room, usernames, function (err, result) {
		this.dialog.hide();
	}.bind(this));
};

RoomInvite.prototype.redrawFormContent = function (items, query) {
	render(
		this.formContent,
		template('dialogs/invite-form-content.jade', {
			items: items,
			query: query
		})
	);
};