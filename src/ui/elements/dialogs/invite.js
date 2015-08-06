/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Dialog = require('./dialog');
var events = require('events');
var qs = require('query');
var _ = require('t');
var closest = require('closest');
var classes = require('classes');

module.exports = InviteDialog;

function InviteDialog(context) {
	this.template_path = 'dialogs/invite.jade';
	Dialog.call(this, context);
};

InviteDialog.prototype = Object.create(Dialog.prototype);

InviteDialog.prototype.bind = function InviteDialog_bind() {
	this.events = events(this.el, this);
	this.events.bind('submit .invite-to-room', 'inviteToRoom');
	this.events.bind('input .input-invite', 'resetValidity');
	this.events.bind('click .channel-item.free', 'addUserInvite');
	this.events.bind('click .channel-item.taken', 'removeUserInvite');
};

InviteDialog.prototype.inviteToRoom = function InviteDialog_inviteToRoom(ev) {
	ev.preventDefault();
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

	this.emit('inviteToRoom', ui.room, users, function inviteToRoom_callback(err, result){
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
	}.bind(this));
};

InviteDialog.prototype.resetValidity = function InviteDialog_resetValidity() {
	var inviteInput = qs('.input-invite', this.el);
	inviteInput.setCustomValidity('');
};

InviteDialog.prototype.addUserInvite = function InviteDialog_addUserInvite(ev) {
	var user = closest(ev.target, '.channel-item', true);
	var username = user.getAttribute('data-username');
	var inviteInput = qs('.input-invite', this.el);
	inviteInput.value = inviteInput.value + username + ', ';
	setTimeout(function() {
		classes(user).add('taken');
		classes(user).remove('free');
	});
}

InviteDialog.prototype.removeUserInvite = function InviteDialog_removeUserInvite(ev) {
	var user = closest(ev.target, '.channel-item', true);
	var username = user.getAttribute('data-username') + ', ';
	var inviteInput = qs('.input-invite', this.el);
	inviteInput.value = inviteInput.value.replace(username, '');
	setTimeout(function() {
		classes(user).remove('taken');
		classes(user).add('free');
	});
}

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
	if (this[i] === deleteValue) {
	  this.splice(i, 1);
	  i--;
	}
  }
  return this;
};