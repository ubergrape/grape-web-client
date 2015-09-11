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

module.exports = InviteDialog;

function InviteDialog(context) {
	this.template_path = 'dialogs/invite.jade';
	this.formContent = {};
	Dialog.call(this, context);
};

InviteDialog.prototype = Object.create(Dialog.prototype);

var protoInit = InviteDialog.prototype.init;

InviteDialog.prototype.init = function () {
	var context = this.context;
	var userList = this.userList = new ItemList({
		template: 'dialogs/userlist.jade'
	});
	userList.setItems(context.users);
	userList.order('displayName');

	this.uninvitedUsers = context.users;
	protoInit.call(this);

	replace(qs('.invite-list', this.dialog.el), userList.el);
	this.redrawFormContent([]);
	replace(qs('.form-content', this.dialog.el), this.formContent.el);
}

function replace(from, to) {
	from.parentNode.replaceChild(to, from);
}

InviteDialog.prototype.bind = function InviteDialog_bind() {
	this.events = events(this.el, this);
	this.events.bind('click .form-content', 'focusInput');
	this.events.bind('click .invite-to-room .user', 'toggleUser');
	this.events.bind('click .room-invite-button', 'inviteToRoom');
	this.events.bind('keyup .input-invite', 'onKeyUp');
	this.events.bind('keydown .input-invite', 'onKeyDown');
};

InviteDialog.prototype.toggleUser = function (ev) {
	var itemID = closest(ev.target, 'li', true).getAttribute('data-id');
	var item = this.userList.items.filter(function (el){
		return el.id == itemID;
	})[0];
	this.userList.toggleItem(item);
	this.redrawFormContent(this.userList.highlighted);
	this.filterUsers();
	this.userList.redraw();
	this.focusInput();
}

InviteDialog.prototype.focusInput = function () {
	qs('.input-invite', this.dialog.el).focus();
}

InviteDialog.prototype.onKeyDown = function (ev) {
	var filterInput = qs('.input-invite', this.dialog.el);
	var query = filterInput.value;
	if (!query && keyname(ev.which) == 'backspace') {
		this.userList.highlighted.pop();
		this.redrawFormContent(this.userList.highlighted);
		this.focusInput();
	}
}

InviteDialog.prototype.onKeyUp = function (ev) {
	var filterInput = qs('.input-invite', this.dialog.el);
	var query = filterInput.value;
	this.filterUsers(query);
	filterInput.style.width = 15 + filterInput.value.length * 7 + 'px';
	this.userList.redraw();
}

InviteDialog.prototype.filterUsers = function (query) {
	if (query) {
		var suggestions = this.uninvitedUsers.filter(function (user) {
			return user.username.toLowerCase().indexOf(query) != -1
				|| user.displayName.toLowerCase().indexOf(query) != -1
		});
		suggestions.sort(function (a, b) {
			if (a.username.toLowerCase().startsWith(query)
				|| a.displayName.toLowerCase().startsWith(query))
				return -1
			else
				return 1
		});
		this.userList.items = suggestions;
	} else {
		this.userList.items = this.uninvitedUsers;
	}
}

InviteDialog.prototype.redrawFormContent = function (items) {
	render(
		this.formContent,
		template('dialogs/invite-form-content.jade', {
			items: items
		})
	);
}