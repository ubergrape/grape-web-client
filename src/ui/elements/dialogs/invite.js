/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Dialog = require('./dialog');
var events = require('events');
var qs = require('query');
var closest = require('closest');
var ItemList = require('../itemlist');

module.exports = InviteDialog;

function InviteDialog(context) {
	this.template_path = 'dialogs/invite.jade';
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
	this.filterInput = qs('.input-invite', this.dialog.el);
	replace(qs('.invite-list', this.dialog.el), userList.el);
}

function replace(from, to) {
	from.parentNode.replaceChild(to, from);
}

InviteDialog.prototype.bind = function InviteDialog_bind() {
	this.events = events(this.el, this);
	this.events.bind('click .invite-to-room .user', 'toggleUser');
	this.events.bind('click .room-invite-button', 'inviteToRoom');
	this.events.bind('keyup .input-invite', 'filterUsers');
	/*
	this.events.bind('submit .invite-to-room', 'inviteToRoom');
	this.events.bind('input .input-invite', 'resetValidity');
	this.events.bind('click .channel-item.free', 'addUserInvite');
	this.events.bind('click .channel-item.taken', 'removeUserInvite');*/
};

InviteDialog.prototype.toggleUser = function (ev) {
	var itemID = closest(ev.target, 'li', true).getAttribute('data-id');
	var item = this.userList.items.filter(function (el){
		return el.id == itemID;
	})[0];
	this.userList.toggleItem(item);
	var usernames = this.userList.highlighted.map(function (user) {
		return user.username;
	}).toString().replace(/,/g, ', ').concat(', ');
	this.filterInput.value = usernames;
	this.filterUsers();
}

InviteDialog.prototype.filterUsers = function () {
	var query = this.filterInput.value.split(', ');
	query = query[query.length - 1];
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

	this.userList.redraw();
}

InviteDialog.prototype.inviteToRoom = function InviteDialog_inviteToRoom(ev) {
	/*ev.preventDefault();
	var inviteInput = qs('.input-invite', this.el);
	var inviteButton = qs('.btn-invite', this.el);
	this.resetValidity();
	if (inviteInput.value === '') {
		inviteInput.setCustomValidity(_('Please enter at least one user to invite'));
		setTimeout(function() {inviteButton.click();}.bind(this), 500)
		return;
	}

	var users = inviteInput.value.split(/[\s,;]+/);
	users.clean("");

	inviteButton.disabled = true;

	this.emit('inviteToRoom', this.context.room, users, function inviteToRoom_callback(err, result){
		if (err) {
			var errorText = err.details ? err.details : _('You cannot invite those users.')
			inviteInput.setCustomValidity(err.details);
			setTimeout(function() {inviteButton.click();}.bind(this), 500)
		} else {
			inviteInput.value = '';
			qs('.close', this.el).click();
		}
		inviteButton.disabled = false;
		delete inviteButton.disabled;
	}.bind(this));*/
};

InviteDialog.prototype.resetValidity = function InviteDialog_resetValidity() {
	/*var inviteInput = qs('.input-invite', this.el);
	inviteInput.setCustomValidity('');
	*/
};

InviteDialog.prototype.addUserInvite = function InviteDialog_addUserInvite(ev) {
	/*var user = closest(ev.target, '.channel-item', true);
	var username = user.getAttribute('data-username');
	var inviteInput = qs('.input-invite', this.el);
	inviteInput.value = inviteInput.value + username + ', ';
	setTimeout(function() {
		classes(user).add('taken');
		classes(user).remove('free');
	});
	this.resetValidity();*/
}

InviteDialog.prototype.removeUserInvite = function InviteDialog_removeUserInvite(ev) {
	/*var user = closest(ev.target, '.channel-item', true);
	var username = user.getAttribute('data-username') + ', ';
	var inviteInput = qs('.input-invite', this.el);
	inviteInput.value = inviteInput.value.replace(username, '');
	setTimeout(function() {
		classes(user).remove('taken');
		classes(user).add('free');
	});*/
}

/*Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
	if (this[i] === deleteValue) {
	  this.splice(i, 1);
	  i--;
	}
  }
  return this;
};
*/